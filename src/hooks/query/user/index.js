import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, API_ERRORS, STALE_TIME, USER_LIST_KEY } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const useUserQuery = ({ search, sort, options = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [USER_LIST_KEY, organizationId, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.user_by_organization
      }

      const response = await Axios.get(
        buildApiURL(API.USER.BY_ORGANIZATION, { organization_id: organizationId })
      )

      return response.data
    },
    enabled: Boolean(!isServer),
    staleTime: STALE_TIME,
    ...options,
  })

  if (query.isError && query.error) {
    showAPIErrorMessage(query.error, API_ERRORS.USER_LIST)
  }

  const data = query.data?.users || []

  // -- search and sort --
  const filteredData = useMemo(() => {
    let result = [...(data || [])]

    if (search) {
      const lowerSearchTerm = toLower(search)

      result = result.filter(
        (item) =>
          includes(toLower(item.company), lowerSearchTerm) ||
          includes(toLower(item.name), lowerSearchTerm) ||
          includes(toLower(item.mail), lowerSearchTerm)
      )
    }

    if (sort) {
      try {
        const sortObject = tryParseJson(sort)?.[0]

        const sortBy = get(sortObject, 'field')
        const sortOrder = get(sortObject, 'value', 'asc')

        return orderBy(data, [sortBy], [sortOrder])
      } catch (error) {
        // handle error
        return data
      }
    } else {
      // sort default
      result = orderBy(result, ['enable', 'company', 'mail'], ['desc', 'asc', 'asc'])
    }

    return result
  }, [data, search, sort])

  // -- get detail --
  const getUserDetail = (userId) => {
    return data.find((user) => user?.id === userId) || null
  }

  return { ...query, data, filteredData, getUserDetail }
}

export const useUserCreate = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.post(API.USER.CREATE, params, { timeout: 60000 })
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([USER_LIST_KEY, organizationId, stubEnabled])
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.USER_CREATE)
    },
  })

  const doCreateUser = useDebouncedCallback(mutateAsync)
  return { doCreateUser, isPending, isSuccess }
}

export const useUserUpdate = ({ userId, onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.put(buildApiURL(API.USER.UPDATE, { user_id: userId }), params)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([USER_LIST_KEY, organizationId, stubEnabled])
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.USER_UPDATE)
    },
  })

  const doUpdateUser = useDebouncedCallback(mutateAsync)

  return { doUpdateUser, isPending, isSuccess }
}

import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, API_ERROR_MESSAGES, STALE_TIME, USER_LIST_KEY } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
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
      if (stubEnabled) return mockData.user_by_organization

      const response = await Axios.get(
        buildApiURL(API.USER.BY_ORGANIZATION, { organization_id: organizationId })
      )

      return response.data
    },
    enabled: Boolean(!isServer),
    staleTime: STALE_TIME,
    ...options,
  })

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

export const useUserPermissions = () => {
  const { organizationDetail } = useOrganizationQuery()
  const permissions = organizationDetail?.authorized_apis || []

  return { permissions }
}

export const useUserCreate = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.post(API.USER.CREATE, params, { timeout: 60000 })
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([USER_LIST_KEY, organizationId, stubEnabled])
      onSuccess?.(response)
    },
    onError: (error) => {
      const errorCode = get(error, 'response.data.error_code')
      const errorMess = API_ERROR_MESSAGES.USER[errorCode]
      message.error(errorMess)
    },
  })

  const doCreateUser = useDebouncedCallback(mutate)
  return { doCreateUser, isPending, isSuccess }
}

export const useUserUpdate = ({ userId, onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.put(buildApiURL(API.USER.UPDATE, { user_id: userId }), params)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([USER_LIST_KEY, organizationId, stubEnabled])
      onSuccess?.(response)
    },
    onError: (error) => {
      const errorCode = get(error, 'response.data.error_code')
      const errorMess = API_ERROR_MESSAGES.USER[errorCode]
      message.error(errorMess)
    },
  })

  const doUpdateUser = useDebouncedCallback(mutate)

  return { doUpdateUser, isPending, isSuccess }
}
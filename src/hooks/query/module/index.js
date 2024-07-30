/* eslint-disable no-console */
import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, API_ERRORS, MODULE_LIST_KEY, STALE_TIME } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const useModuleQuery = ({ search, sort, options = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [MODULE_LIST_KEY, organizationId, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.module
      }

      const response = await Axios.get(
        buildApiURL(API.MODULE.LIST, { organization_id: organizationId })
      )

      return response.data
    },
    enabled: Boolean(!isServer),
    staleTime: STALE_TIME,
    ...options,
  })

  if (query.isError && query.error) {
    showAPIErrorMessage(query.error, API_ERRORS.MODULE_LIST)
  }

  const data = query.data?.modules || []

  // -- search and sort --
  const filteredData = useMemo(() => {
    let result = [...(data || [])]

    if (search) {
      const lowerSearchTerm = toLower(search)
      result = result.filter(
        (item) =>
          includes(toLower(item.name), lowerSearchTerm) ||
          includes(toLower(item.description), lowerSearchTerm)
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
      result = orderBy(result, ['update_date', 'name'], ['desc', 'asc'])
    }

    return result
  }, [data, search, sort])

  // -- get detail --
  const getModuleDetail = (moduleId) => {
    return data.find((module) => module?.id === moduleId) || null
  }

  return { ...query, data, filteredData, getModuleDetail }
}

export const useModuleCreate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.post(
        buildApiURL(API.MODULE.CREATE, { organization_id: organizationId }),
        { ...params },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      )
      return response
    },
    onSuccess: (response) => {
      console.log('response', response)
      queryClient.invalidateQueries([MODULE_LIST_KEY, organizationId])
      onSuccess?.(response)
    },
    onError: (error) => {
      console.log('error', error)
      showAPIErrorMessage(error, API_ERRORS.MODULE_CREATE)
    },
  })

  const doCreateModule = useDebouncedCallback(mutate)

  return { doCreateModule, isPending, isSuccess }
}

export const useModuleUpdate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ id: moduleId, ...params }) => {
      const response = await Axios.put(
        buildApiURL(API.MODULE.UPDATE, { organization_id: organizationId, module_id: moduleId }),
        { ...params },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      )
      return response
    },
    onSuccess: (response) => {
      console.log('response', response)
      queryClient.invalidateQueries([MODULE_LIST_KEY, organizationId])
      onSuccess?.(response)
    },
    onError: (error) => {
      console.log('error', error)
      showAPIErrorMessage(error, API_ERRORS.MODULE_UPDATE)
    },
  })

  const doUpdateModule = useDebouncedCallback(mutate)

  return { doUpdateModule, isPending, isSuccess }
}

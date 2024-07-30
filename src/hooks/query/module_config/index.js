/* eslint-disable no-console */
import { isServer, useQuery } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, MODULE_CONFIG_LIST_KEY, STALE_TIME } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'

import { mapOptionsQuery, tryParseJson } from '@/utils/helper/functions'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'
import { useProjectActive } from '../project'

export const useModuleConfigQuery = ({ search, sort, options = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { projectActiveId } = useProjectActive()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [MODULE_CONFIG_LIST_KEY, organizationId, projectActiveId, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.module_config
      }

      const response = await Axios.get(
        buildApiURL(API.MODULE_CONFIG.LIST, {
          organization_id: organizationId,
          project_id: projectActiveId,
        })
      )

      return response.data
    },
    enabled: Boolean(!isServer && organizationId),
    staleTime: STALE_TIME,
    ...options,
  })

  const data = query.data?.module_configs || []

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
        console.error('Error sorting data:', error)
        return data
      }
    } else {
      // sort default
      result = orderBy(result, ['update_date', 'name'], ['desc', 'asc'])
    }

    return result
  }, [data, search, sort])

  // -- get detail --
  const getModuleConfigDetail = (moduleConfigId) => {
    return data.find((moduleConfig) => moduleConfig?.id === moduleConfigId) || null
  }

  // -- get options --
  const getModuleConfigOptions = () => {
    return mapOptionsQuery(data)
  }

  return { ...query, data, filteredData, getModuleConfigDetail, getModuleConfigOptions }
}

export const useModuleConfigCreate = ({ onSuccess } = {}) => {
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

export const useModuleConfigUpdate = ({ onSuccess } = {}) => {
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

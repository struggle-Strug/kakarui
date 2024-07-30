/* eslint-disable no-console */
import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, API_ERRORS, MODULE_CONFIG_LIST_KEY, STALE_TIME } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { mapOptionsQuery, tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
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

  if (query.isError && query.error) {
    showAPIErrorMessage(query.error, API_ERRORS.MODULE_CONFIG_LIST)
  }

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

export const useModuleConfigDetailQuery = (moduleConfigId) => {
  const { organizationId } = useOrganizationQuery()
  const { projectActiveId } = useProjectActive()
  const { stubEnabled } = useStubEnabled()

  const queryClient = useQueryClient()

  const cacheData = queryClient.getQueryData([
    MODULE_CONFIG_LIST_KEY,
    organizationId,
    projectActiveId,
    stubEnabled,
  ])

  const data =
    cacheData && cacheData.moduleset !== undefined
      ? cacheData.module_configs.find((moduleConfig) => moduleConfig?.id === moduleConfigId)
      : null

  return data
}

export const useModuleConfigCreate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { projectActiveId } = useProjectActive()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.post(
        buildApiURL(API.MODULE_CONFIG.CREATE, {
          organization_id: organizationId,
          project_id: projectActiveId,
        }),
        { ...params }
      )
      return response
    },
    onSuccess: (response) => {
      console.log('response', response)
      queryClient.invalidateQueries([MODULE_CONFIG_LIST_KEY, organizationId])
      onSuccess?.(response)
    },
    onError: (error) => {
      console.log('error', error)
      showAPIErrorMessage(error, API_ERRORS.MODULE_CONFIG_CREATE)
    },
  })

  const doCreateModuleConfig = useDebouncedCallback(mutate)

  return { doCreateModuleConfig, isPending, isSuccess }
}

export const useModuleConfigUpdate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { projectActiveId } = useProjectActive()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ id: moduleConfigId, ...params }) => {
      const response = await Axios.put(
        buildApiURL(API.MODULE_CONFIG.UPDATE, {
          organization_id: organizationId,
          project_id: projectActiveId,
          module_config_id: moduleConfigId,
        }),
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
      queryClient.invalidateQueries([MODULE_CONFIG_LIST_KEY, organizationId])
      onSuccess?.(response)
    },
    onError: (error) => {
      console.log('error', error)
      showAPIErrorMessage(error, API_ERRORS.MODULE_CONFIG_UPDATE)
    },
  })

  const doUpdateModuleConfig = useDebouncedCallback(mutate)

  return { doUpdateModuleConfig, isPending, isSuccess }
}

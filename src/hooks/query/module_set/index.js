import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, API_ERRORS, MODULE_SET_LIST_KEY } from '@/constants'
import { useShowErrorOnce, useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const useModuleSetQuery = ({ search, sort, options = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [MODULE_SET_LIST_KEY, organizationId, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.module_set
      }

      const response = await Axios.get(
        buildApiURL(API.MODULE_SET.LIST, { organization_id: organizationId })
      )

      return response.data
    },
    enabled: Boolean(!isServer),
    staleTime: Infinity,
    ...options,
  })

  useShowErrorOnce(query, API_ERRORS.MODULE_SET_LIST)

  const data = query.data?.moduleset || []

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
  const getModuleSetDetail = (moduleSetId) => {
    return data.find((moduleSet) => moduleSet?.id === moduleSetId) || null
  }

  return { ...query, data, filteredData, getModuleSetDetail }
}

export const useModuleSetCreate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.post(
        buildApiURL(API.MODULE_SET.CREATE, { organization_id: organizationId }),
        { ...params }
      )
      return response
    },
    onSuccess: (response) => {
      queryClient.refetchQueries({
        queryKey: [MODULE_SET_LIST_KEY, organizationId, false],
      })
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.MODULE_SET_CREATE)
    },
  })

  const doCreateModuleSet = useDebouncedCallback(mutate)

  return { doCreateModuleSet, isPending, isSuccess }
}

export const useModuleSetUpdate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ id: moduleSetId, ...params }) => {
      const response = await Axios.put(
        buildApiURL(API.MODULE_SET.UPDATE, {
          organization_id: organizationId,
          module_set_id: moduleSetId,
        }),
        { ...params }
      )
      return response
    },
    onSuccess: (response) => {
      queryClient.refetchQueries({
        queryKey: [MODULE_SET_LIST_KEY, organizationId, false],
      })
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.MODULE_SET_UPDATE)
    },
  })

  const doUpdateModuleSet = useDebouncedCallback(mutate)

  return { doUpdateModuleSet, isPending, isSuccess }
}

export const useModuleSetDelete = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ id: moduleSetId, ...params }) => {
      const response = await Axios.delete(
        buildApiURL(API.MODULE_SET.UPDATE, {
          organization_id: organizationId,
          module_set_id: moduleSetId,
        }),
        { ...params }
      )
      return response
    },
    onSuccess: (response) => {
      queryClient.refetchQueries({
        queryKey: [MODULE_SET_LIST_KEY, organizationId, false],
      })
      message.success('モジュールセットを削除しました。')
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.MODULE_SET_DELETE)
    },
  })

  const doDeleteModuleSet = useDebouncedCallback(mutate)

  return { doDeleteModuleSet, isPending, isSuccess }
}

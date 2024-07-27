/* eslint-disable no-console */
import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, API_ERROR_MESSAGES, LOCAL_STORAGE_KEYS, PROJECT_LIST_KEY } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback, useSyncLocalStorage } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const useProjectActive = () => {
  const [projectActive, setProjectActive] = useSyncLocalStorage(LOCAL_STORAGE_KEYS.PROJECT, {})

  return {
    projectActiveId: projectActive?.id,
    projectActive,
    setProjectActive,
  }
}

export const useProjectQuery = ({ search, sort, options = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [PROJECT_LIST_KEY, organizationId, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.project_list
      }

      try {
        const response = await Axios.get(
          buildApiURL(API.PROJECT.LIST, { organization_id: organizationId })
        )

        return response.data.projects || []
      } catch (error) {
        console.error('Error fetching deploy data for projects:', error)
        return []
      }
    },
    enabled: Boolean(!isServer && organizationId),
    staleTime: Infinity,
    ...options,
  })

  const data = query.data || []

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
  const getProjectDetail = (projectId) => {
    return data.find((project) => project?.id === projectId) || null
  }

  return { ...query, data, filteredData, getProjectDetail }
}

export const useProjectCreate = ({ onSuccess, message } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.post(
        buildApiURL(API.PROJECT.CREATE, { organization_id: organizationId }),
        { ...params }
      )
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([PROJECT_LIST_KEY, organizationId])
      onSuccess?.(response)
    },
    onError: (error) => {
      const errorCode = get(error, 'response.data.error_code')
      const errorMess = API_ERROR_MESSAGES.PROJECT[errorCode]
      message.error(errorMess)
    },
  })

  const doCreateProject = useDebouncedCallback(mutate)

  return { doCreateProject, isPending, isSuccess }
}

export const useProjectUpdate = ({ onSuccess, message } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ id: projectId, ...params }) => {
      const response = await Axios.put(
        buildApiURL(API.PROJECT.UPDATE, { organization_id: organizationId, project_id: projectId }),
        { ...params }
      )
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([PROJECT_LIST_KEY, organizationId])
      onSuccess?.(response)
    },
    onError: (error) => {
      const errorCode = get(error, 'response.data.error_code')
      const errorMess = API_ERROR_MESSAGES.PROJECT[errorCode]
      message.error(errorMess)
    },
  })

  const doUpdateProject = useDebouncedCallback(mutate)

  return { doUpdateProject, isPending, isSuccess }
}

/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable no-console */
import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import chunk from 'lodash/chunk'
import get from 'lodash/get'
import includes from 'lodash/includes'
import noop from 'lodash/noop'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  API,
  API_ERRORS,
  DEPLOY_LIST_KEY,
  INTERVAL_5M,
  INTERVAL_15S,
  MODULE_CONFIG_LIST_KEY,
  STALE_TIME,
} from '@/constants'
import { useShowErrorOnce, useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'
import { useProjectActive, useProjectQuery } from '../project'

export const useDeployQuery = ({ search, sort, options = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { projectActiveId } = useProjectActive()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [DEPLOY_LIST_KEY, organizationId, projectActiveId, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.deploy_list
      }

      const response = await Axios.get(
        buildApiURL(API.DEPLOY.LIST, {
          organization_id: organizationId,
          project_id: projectActiveId,
        })
      )

      return response.data
    },
    enabled: Boolean(!isServer && organizationId && projectActiveId),
    refetchInterval: INTERVAL_15S,
    staleTime: STALE_TIME,
    ...options,
  })

  useShowErrorOnce(query, API_ERRORS.DEPLOY_LIST)

  const data = query.data?.deploys || []

  // -- search and sort --
  const filteredData = useMemo(() => {
    let result = [...(data || [])]

    if (search) {
      const lowerSearchTerm = toLower(search)
      result = result.filter((item) => includes(toLower(item.module_config_name), lowerSearchTerm))
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
      result = orderBy(result, ['create_date', 'module_config_name'], ['desc', 'asc'])
    }

    return result
  }, [data, search, sort])

  // -- get detail --
  const getDeployDetail = (deployId) => {
    return data.find((deploy) => deploy?.id === deployId) || null
  }

  return { ...query, data, filteredData, getDeployDetail }
}

const fetchDeployData = async (organizationId, projectId) => {
  try {
    const response = await Axios.get(
      buildApiURL(API.DEPLOY.LIST, {
        organization_id: organizationId,
        project_id: projectId,
      })
    )

    return response.data.deploys || []
  } catch (error) {
    console.error('Error fetching deploy data for project', projectId, ':', error)
    return []
  }
}

export const useMyDeployQuery = ({ limit } = {}) => {
  const queryClient = useQueryClient()

  const { stubEnabled } = useStubEnabled() || {}
  const { organizationId } = useOrganizationQuery() || {}

  const { data: projects = [] } = useProjectQuery() || {}

  const projectIds = useMemo(() => {
    const ids = (projects || []).map((p) => p?.id)
    console.log('Project IDs:', ids)
    return ids
  }, [projects])

  const [isLoading, setIsLoading] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  useEffect(() => {
    const fetchAllDeployData = async () => {
      if (projectIds.length === 0) return

      setIsLoading(true)
      const chunkedProjectIds = chunk(projectIds, 5)
      console.log('Chunked Project IDs:', chunkedProjectIds)

      try {
        for (const projectChunk of chunkedProjectIds) {
          await Promise.allSettled(
            projectChunk.map((projectId) =>
              queryClient.fetchQuery({
                queryKey: [DEPLOY_LIST_KEY, organizationId, projectId],
                queryFn: () => fetchDeployData(organizationId, projectId),
                staleTime: Infinity,
              })
            )
          )
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (typeof window !== 'undefined' && organizationId && projectIds.length > 0) {
      fetchAllDeployData()
    }
  }, [projectIds, organizationId, queryClient])

  // Create a single useQuery to fetch data for all projectIds
  const deployQuery = useQuery({
    queryKey: [DEPLOY_LIST_KEY, organizationId, projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return []

      const chunkedProjectIds = chunk(projectIds, 5)
      const results = []

      for (const projectChunk of chunkedProjectIds) {
        const chunkResults = await Promise.allSettled(
          projectChunk.map((projectId) => fetchDeployData(organizationId, projectId))
        )

        chunkResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(...result.value)
          } else {
            console.error(
              `Error fetching data for projectId ${projectChunk[index]}:`,
              result.reason
            )
          }
        })
      }

      return results
    },
    placeholderData: [],
    enabled: projectIds.length > 0 && !stubEnabled,
    refetchInterval: INTERVAL_5M,
    staleTime: Infinity,
  })

  if (deployQuery.isError && deployQuery.error) {
    showAPIErrorMessage(deployQuery.error, API_ERRORS.PROJECT_LIST)
  }

  const deployData = useMemo(() => {
    const result = deployQuery.data || []
    console.log('Deploy Data Result:', result)

    const projectIdToNameMap = (projects || []).reduce((map, project) => {
      if (project?.id && project?.name) {
        map[project.id] = project.name
      }
      return map
    }, {})

    const enhancedResult = (result || []).map((deploy) => ({
      ...deploy,
      project_name: projectIdToNameMap[deploy.project_id] || null,
    }))

    return orderBy(enhancedResult, ['create_date'], ['asc'])
  }, [deployQuery.data, projects])

  const refetchAll = useCallback(async () => {
    setIsRefetching(true)
    if (stubEnabled) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } else {
      await deployQuery.refetch()
    }
    setIsRefetching(false)
  }, [deployQuery, stubEnabled])

  const slicedData = limit ? deployData.slice(0, limit) : deployData
  const data = stubEnabled ? mockData.my_deploy_list : slicedData

  return {
    loading: isLoading || isRefetching || deployQuery.isLoading,
    data: isLoading ? [] : data,
    refetch: refetchAll,
  }
}
export const useDeployStart = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()
  const { projectActiveId } = useProjectActive()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.post(
        buildApiURL(API.DEPLOY.START, {
          organization_id: organizationId,
          project_id: projectActiveId,
        }),
        params
      )
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([DEPLOY_LIST_KEY, organizationId, projectActiveId, false])
      queryClient.invalidateQueries([
        MODULE_CONFIG_LIST_KEY,
        organizationId,
        projectActiveId,
        false,
      ])

      message.success('デプロイ要求が受理されました。')
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.DEPLOY_START)
    },
  })

  const doDeployStart = useDebouncedCallback(mutate)

  return { doDeployStart, isPending, isSuccess }
}

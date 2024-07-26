/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable no-console */
import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import chunk from 'lodash/chunk'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  API,
  API_ERROR_MESSAGES,
  DEPLOY_LIST_KEY,
  INTERVAL_5M,
  INTERVAL_15S,
  MODULE_CONFIG_LIST_KEY,
  STALE_TIME,
} from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
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

  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const { data: projects = [] } = useProjectQuery()
  const projectIds = useMemo(() => projects.map((p) => p?.id), [projects])

  const [isLoading, setIsLoading] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  useEffect(() => {
    const fetchAllDeployData = async () => {
      setIsLoading(true)
      const chunkedProjectIds = chunk(projectIds, 5)

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

    if (!isServer && organizationId && projectIds.length > 0) {
      fetchAllDeployData()
    }
  }, [projectIds, organizationId, fetchDeployData])

  const deployQueries = (projectIds || []).map((projectId) =>
    useQuery({
      queryKey: [DEPLOY_LIST_KEY, organizationId, projectId],
      queryFn: () => fetchDeployData(organizationId, projectId),
      placeholderData: mockData.my_deploy_list,
      refetchInterval: INTERVAL_5M,
      enabled: !stubEnabled,
      staleTime: Infinity,
    })
  )

  const deployData = useMemo(() => {
    const result = deployQueries
      .filter((query) => query.isSuccess && query.data)
      .flatMap((query) => query.data)

    const projectIdToNameMap = projects.reduce((map, project) => {
      if (project?.id && project?.name) {
        map[project.id] = project.name
      }
      return map
    }, {})

    const enhancedResult = result.map((deploy) => ({
      ...deploy,
      project_name: projectIdToNameMap[deploy.project_id] || null,
    }))

    return orderBy(enhancedResult, ['create_date'], ['asc'])
  }, [deployQueries, projects])

  const refetchAll = useCallback(async () => {
    setIsRefetching(true)
    if (stubEnabled) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } else {
      await Promise.allSettled(deployQueries.map((query) => query.refetch()))
    }
    setIsRefetching(false)
  }, [deployQueries, stubEnabled])

  const slicedData = limit ? deployData.slice(0, limit) : deployData
  const data = stubEnabled ? mockData.my_deploy_list : slicedData

  return {
    loading: isLoading || isRefetching,
    data: isLoading ? [] : data,
    refetch: refetchAll,
  }
}

export const useDeployStart = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()
  const { projectActiveId } = useProjectActive()
  const { stubEnabled } = useStubEnabled()

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
      queryClient.invalidateQueries([DEPLOY_LIST_KEY, organizationId, projectActiveId, stubEnabled])
      queryClient.invalidateQueries([
        MODULE_CONFIG_LIST_KEY,
        organizationId,
        projectActiveId,
        stubEnabled,
      ])

      if (response?.data?.message) {
        message.success(response.data.message)
      }

      onSuccess?.(response)
    },
    onError: (error) => {
      const errorCode = get(error, 'response.data.error_code')
      const errorMess = API_ERROR_MESSAGES.DEPLOY[errorCode]
      message.error(errorMess)
    },
  })

  const doDeployStart = useDebouncedCallback(mutate)

  return { doDeployStart, isPending, isSuccess }
}

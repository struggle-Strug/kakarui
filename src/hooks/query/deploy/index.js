/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable no-console */
import { isServer, useQuery, useQueryClient } from '@tanstack/react-query'
import chunk from 'lodash/chunk'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { API, DEPLOY_LIST_KEY, INTERVAL_15S, STALE_TIME } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'

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
      if (stubEnabled) return mockData.deploy_list

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

export const useMyDeploy = ({ limit } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const { data: projects = [] } = useProjectQuery()
  const projectIds = projects.map((p) => p?.id)

  const [isFetching, setIsFetching] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const fetchDeployData = async (projectId) => {
    if (stubEnabled) return mockData.deploy_list.deploys || []

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

  useEffect(() => {
    const fetchAllDeployData = async () => {
      setIsFetching(true)
      const chunkedProjectIds = chunk(projectIds, 5)

      for (const projectChunk of chunkedProjectIds) {
        await Promise.allSettled(
          projectChunk.map((projectId) =>
            queryClient.fetchQuery({
              queryKey: [DEPLOY_LIST_KEY, organizationId, projectId, stubEnabled],
              queryFn: () => fetchDeployData(projectId),
              staleTime: Infinity,
            })
          )
        )
      }
      setIsFetching(false)
    }

    if (!isServer && organizationId && projectIds.length > 0) {
      fetchAllDeployData()
    }
  }, [projectIds, organizationId, queryClient, fetchDeployData])

  const deployQueries = projectIds.map((projectId) =>
    useQuery({
      queryKey: [DEPLOY_LIST_KEY, organizationId, projectId, stubEnabled],
      queryFn: () => fetchDeployData(projectId),
      staleTime: Infinity,
      enabled: false,
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
    await Promise.allSettled(deployQueries.map((query) => query.refetch()))
    setIsRefetching(false)
  }, [deployQueries])

  return {
    isLoading: isFetching || isRefetching || deployQueries.some((query) => query.isLoading),
    isError: deployQueries.some((query) => query.isError),
    data: limit ? deployData.slice(0, limit) : deployData,
    refetch: refetchAll,
  }
}

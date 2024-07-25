/* eslint-disable no-console */
import { isServer, useQuery } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, DEPLOY_LIST_KEY, INTERVAL_15S, STALE_TIME } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'

import { tryParseJson } from '@/utils/helper/functions'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'
import { useProjectActive } from '../project'

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

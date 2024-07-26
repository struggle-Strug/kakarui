/* eslint-disable no-console */
import { isServer, useQuery } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, LOCAL_STORAGE_KEYS, ROBOT_LIST_KEY } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useSyncLocalStorage } from '@/hooks/share'

import { mapOptionsQuery, tryParseJson } from '@/utils/helper/functions'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const useRobotActive = () => {
  const [robotActive, setRobotActive] = useSyncLocalStorage(LOCAL_STORAGE_KEYS.ROBOT, {})

  return {
    robotActiveId: robotActive?.id,
    setRobotActive,
    robotActive,
  }
}

export const useRobotQuery = ({ search, sort, options = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [ROBOT_LIST_KEY, organizationId, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.robot_list
      }

      const response = await Axios.get(
        buildApiURL(API.ROBOT.LIST, { organization_id: organizationId })
      )

      return response.data
    },
    enabled: Boolean(!isServer && organizationId),
    staleTime: Infinity,
    ...options,
  })

  const data = query.data?.robots || []

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
  const getRobotDetail = (robotId) => {
    return data.find((robot) => robot?.id === robotId) || null
  }

  // -- get options --
  const getRobotOptions = () => {
    return mapOptionsQuery(data, 'model')
  }

  return { ...query, data, filteredData, getRobotDetail, getRobotOptions }
}

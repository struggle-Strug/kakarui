import { isServer, useQuery } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, API_ERRORS, MODULE_LIST_KEY, STALE_TIME } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'

import { tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const useModuleSelectionQuery = ({ search, sort, options = {} } = {}) => {
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

  return { ...query, data, filteredData }
}

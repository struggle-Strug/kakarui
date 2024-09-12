/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable no-console */
import { isServer, useQuery } from '@tanstack/react-query'

import { API, API_ERRORS, API_MOCK, LOG_LIST_KEY, STALE_TIME, VIDEO_LIST_KEY } from '@/constants'
import { useMockApiEnabled, useShowErrorOnce } from '@/hooks/custom'

import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'

import { useOrganizationQuery } from '../organization'

export const useVideoQuery = ({ projectId, options = {}, body = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { mockApiEnabled } = useMockApiEnabled()

  const { file_name: fileName, end_date: endDate } = body || {}

  const query = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [VIDEO_LIST_KEY, organizationId, projectId],
    queryFn: async () => {
      const API_URI = mockApiEnabled ? API_MOCK.URL_CREATE : API.FILE.URL_CREATE

      const response = await Axios.post(
        buildApiURL(API_URI.replace('{storage_name}', 'video'), {
          organization_id: organizationId,
          project_id: projectId,
        }),
        body
      )

      return response.data
    },
    enabled: Boolean(
      !isServer && organizationId && projectId && (mockApiEnabled || (fileName && endDate))
    ),
    staleTime: STALE_TIME,
    retry: false,
    ...options,
  })

  useShowErrorOnce(query, API_ERRORS.COMMON)

  return { ...query }
}

export const useLogQuery = ({ projectId, options = {}, body = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { mockApiEnabled } = useMockApiEnabled()

  const { file_name: fileName, end_date: endDate } = body || {}

  const query = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [LOG_LIST_KEY, organizationId, projectId],
    queryFn: async () => {
      const API_URI = mockApiEnabled ? API_MOCK.URL_CREATE : API.FILE.URL_CREATE

      const response = await Axios.post(
        buildApiURL(API_URI.replace('{storage_name}', 'log'), {
          organization_id: organizationId,
          project_id: projectId,
        }),
        body
      )

      return response?.data
    },
    enabled: Boolean(
      !isServer && organizationId && projectId && (mockApiEnabled || (fileName && endDate))
    ),
    staleTime: STALE_TIME,
    networkMode: 'online',
    ...options,
  })

  useShowErrorOnce(query, API_ERRORS.COMMON)

  return { ...query }
}

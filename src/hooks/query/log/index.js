/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable no-console */
import { isServer, useQuery } from '@tanstack/react-query'

import { API_ERRORS, LOG_LIST_KEY, STALE_TIME, VIDEO_LIST_KEY } from '@/constants'
import { useShowErrorOnce, useStubEnabled } from '@/hooks/custom'

import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const useVideoQuery = ({ projectId, options = {}, body = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [VIDEO_LIST_KEY, organizationId, projectId, body, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.deploy_list
      }

      // TODO: remove when using api
      Axios.defaults.baseURL = 'https://karakuri.agecode.dev'
      const API_URL = '/storages/video/url'

      const response = await Axios.post(
        buildApiURL(API_URL, {
          organization_id: organizationId,
          project_id: projectId,
        }),
        body
      )

      return response.data
    },
    enabled: Boolean(!isServer && organizationId && projectId && body?.file_name && body?.end_date),
    staleTime: STALE_TIME,
    ...options,
  })

  useShowErrorOnce(query, API_ERRORS.COMMON)

  const data = query?.data

  // -- get detail --
  const getDeployDetail = (deployId) => {
    return data.find((deploy) => deploy?.id === deployId) || null
  }

  return { ...query, data, getDeployDetail }
}

export const useLogQuery = ({ projectId, options = {}, body = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [LOG_LIST_KEY, organizationId, projectId, body, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.deploy_list
      }

      // TODO: remove when using api
      Axios.defaults.baseURL = 'https://karakuri.agecode.dev'
      const API_URL = '/storages/log/url'

      const response = await Axios.post(
        buildApiURL(API_URL, {
          organization_id: organizationId,
          project_id: projectId,
        }),
        body
      )

      return response.data
    },
    enabled: Boolean(!isServer && organizationId && projectId && body?.file_name && body?.end_date),
    staleTime: STALE_TIME,
    ...options,
  })

  useShowErrorOnce(query, API_ERRORS.COMMON)

  const data = query?.data

  // -- get detail --
  const getDeployDetail = (deployId) => {
    return data.find((deploy) => deploy?.id === deployId) || null
  }

  return { ...query, data, getDeployDetail }
}

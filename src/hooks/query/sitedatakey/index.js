import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import {
  API,
  API_ERRORS,
  SITE_LIST_KEY,
} from '@/constants'
import { useShowErrorOnce, useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'
import { useQueryStates } from 'nuqs'

export const useSiteDataQuery = ({ search, sort, options = {} } = {}) => {
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [SITE_LIST_KEY, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.module
      }

      const response = await Axios.get(
        API.SITELISTS.LIST,
        {
          timeout: 60000,
          params: {
            is_deleted: false, // クエリパラメータを追加
          },
        }
      )
      let lists = []

      await Promise.all(response.data.sites.map(async(site, key) => {
        const response = await Axios.get(
            buildApiURL(API.SITELISTS.SITEDATA, { site_id: site.id}),
            {
                timeout: 60000,
                params: {
                  is_deleted: false, // クエリパラメータを追加
                },
            }
        )

        const temp = await response.data.site_data.map(sitedata => {
            return {
                ...sitedata,
                area: site.area,
                name: site.name,
                visibility: site.visibility,
                update_user_name: site.update_user_name,
                update_date: site.update_date
            }
        })

        lists.push(...temp)
      }))

    return {lists: lists, siteNames: response.data}
    },
    enabled: Boolean(!isServer),
    staleTime: Infinity,
    ...options,
  })

  useShowErrorOnce(query, API_ERRORS.SITE_LIST)

  const data = query.data?.lists || []
  const siteNames = query.data?.siteNames

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
  const getSiteDataDetail = (site_id) => {
    return data.find((site) => site?.id === site_id) || null
  }

  return { ...query, data, siteNames, filteredData, getSiteDataDetail }
}

export const useSiteDataCreate = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
        const valueNumber = params.value.split(",").length;
        const type = valueNumber > 1 ? 
                        {items: {type: "number"}, type: "array"}
                        : { type: "number"}
        const value = valueNumber > 1 ? params.value.split(",").map(value => value *1) : params.value * 1
        const payload = {
            key: params.key,
            type: type,
            description: params.description,
            value: value,
            visibility: params.visibility
        }

        const response = await Axios.post(
        buildApiURL(API.SITELISTS.CREATE, { site_id: params.area }),
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 1800000, // 1800s
        }
      )
      return response
    },
    onSuccess: async ({ data }) => {
      if (data.status_code === 201) {
        await queryClient.refetchQueries({
          queryKey: [SITE_LIST_KEY, data.site_id, false],
        })
        const list = queryClient.getQueryData([SITE_LIST_KEY, data.site_id, false])
        
        const newSiteData = list?.sitedatas.find((sitedata) => sitedata.data_id === data.data_id) || null
        onSuccess?.(newSiteData)
      }
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.SITEDATA_CREATE)
    },
  })

  const doCreateSiteData = useDebouncedCallback(mutate)

  return { doCreateSiteData, isPending, isSuccess }
}

export const useSiteDataUpdata = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
        const valueNumber = params.value.split(",").length;
        const type = valueNumber > 1 ? 
                        {items: {type: "number"}, type: "array"}
                        : { type: "number"}
        const value = valueNumber > 1 ? params.value.split(",").map(value => value *1) : params.value * 1

        const payload = {
            key: params.key,
            type: type,
            description: params.description,
            value: value,
            visibility: params.visibility
        }

      const response = await Axios.put(
        buildApiURL(API.SITELISTS.UPDATA, { site_id: params.siteId, data_id: params.dataId }),
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 1800000,
        }
      )
      return response
    },
    onSuccess: async (response) => {
      if(response.status === 200){
        // await queryClient.refetchQueries({
        //   queryKey: [SITE_LIST_KEY, response.data.site_id, false],
        // })
        onSuccess?.(response)
      }
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.SITEDATA_UPDATE)
    },
  })

  const doUpdateSiteData = useDebouncedCallback(mutate)

  return { doUpdateSiteData, isPending, isSuccess }
}

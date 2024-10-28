import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import {
  API,
  API_ERRORS,
  PROJECT_LIST_KEY,
} from '@/constants'
import { useShowErrorOnce, useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'
import { useQueryStates } from 'nuqs'
import { useOrganizationQuery } from '../organization'
import { message } from 'antd/lib'

export const useProjectDataQuery = ({ search, sort, options = {} } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: [PROJECT_LIST_KEY, stubEnabled, organizationId],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.module
      }

      const response = await Axios.get(
        buildApiURL(API.PROJECT.LIST, { organization_id: organizationId }),
        {
          timeout: 60000,
          params: {
            is_deleted: false, // クエリパラメータを追加
          },
        }
      )
      let lists = []

      await Promise.all(response.data.projects.map(async(project, key) => {
        const response = await Axios.get(
            buildApiURL(API.PROJECTDATA.LIST, { organization_id: organizationId, project_id: project.id}),
            {
                timeout: 60000,
                params: {
                  is_deleted: false, // クエリパラメータを追加
                },
            }
        )

        const temp = await response.data.datas.map(projectdata => {
            return {
                ...projectdata,
                name: project.name,
            }
        })

        lists.push(...temp)
      }))

      return {lists: lists, projectNames: response.data}
    },
    enabled: Boolean(!isServer),
    staleTime: Infinity,
    ...options,
})

useShowErrorOnce(query, API_ERRORS.PROJECT_LIST)

const data = query.data?.lists || []
const projectNames = query.data?.projectNames

  // -- search and sort --
  const filteredData = useMemo(() => {
    let result = [...(data || [])]

    if (search) {
      const lowerSearchTerm = toLower(search)
      result = result.filter(
        (item) =>
          includes(toLower(item.name), lowerSearchTerm) ||
          includes(toLower(item.key), lowerSearchTerm)
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
  const getProjectDataDetail = (project_id) => {
    return data.find((project) => project?.id === project_id) || null
  }

  return { ...query, data, projectNames, filteredData, getProjectDataDetail }
}

export const useProjectDataCreate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
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
            value: value,
            description: params.description
        }

        const response = await Axios.post(
        buildApiURL(API.PROJECTDATA.CREATE, { organization_id: organizationId, project_id: params.name}),
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
          queryKey: [PROJECT_LIST_KEY, data.site_id, false],
        })
        const list = queryClient.getQueryData([PROJECT_LIST_KEY, data.id, false])
        
        const newProjectData = list?.projectdatas.find((projectdata) => projectdata.data_id === data.data_id) || null
        message.success("プロジェクトデータの登録を完了しました。")
        onSuccess?.(newProjectData)
      }
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.PROJECTDATE_CREATE)
    },
  })

  const doCreateProjectData = useDebouncedCallback(mutate)

  return { doCreateProjectData, isPending, isSuccess }
}

export const useProjectDataUpdate = ({ onSuccess } = {}) => {
    const { organizationId } = useOrganizationQuery()
  
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
            value: value,
            description: params.description
        }
  
          const response = await Axios.put(
          buildApiURL(API.PROJECTDATA.UPDATE, { organization_id: organizationId, project_id: params.project_id, data_id: params.data_id}),
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
      onSuccess: async (response) => {
        if(response.status === 200){
            message.success("プロジェクトデータの更新を完了しました。")
            onSuccess?.(response)
          }
      },
      onError: (error) => {
        showAPIErrorMessage(error, API_ERRORS.PROJECTDATE_UPDATE)
      },
    })

  const doUpdataProjectData = useDebouncedCallback(mutate)

  return { doUpdataProjectData, isPending, isSuccess }
}

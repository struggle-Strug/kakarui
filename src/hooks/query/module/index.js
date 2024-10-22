import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'

import { useMemo } from 'react'

import { API, API_ERRORS, MODULE_LIST_KEY } from '@/constants'
import { useShowErrorOnce, useStubEnabled } from '@/hooks/custom'
import { useDebouncedCallback } from '@/hooks/share'

import { tryParseJson } from '@/utils/helper/functions'
import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const useModuleQuery = ({ search, sort, options = {} } = {}) => {
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
    staleTime: Infinity,
    ...options,
  })

  useShowErrorOnce(query, API_ERRORS.MODULE_LIST)

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

  // -- get detail --
  const getModuleDetail = (moduleId) => {
    return data.find((module) => module?.id === moduleId) || null
  }

  return { ...query, data, filteredData, getModuleDetail }
}

export const useModuleUrlCreate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async ({values, initialValue}) => {
      const payload = {
        name: values.name,
        description: values.description,
        tag: values.tag,
        architectures: initialValue == "single" && values.singlefile && values.singlefile.status !== "removed" ? {} : {
          arm64: true, amd64: true
        }
      }
      if(initialValue == "single" && values.singlefile && values.singlefile.status !== "removed"){
        const response = await Axios.post(
          buildApiURL(API.MODULE.CREATEURL, { organization_id: organizationId }),
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 1800000, // 1800s
          }
        )
        return response
      }
      const response = await Axios.post(
        buildApiURL(API.MODULE.CREATEURL, { organization_id: organizationId }),
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
        onSuccess?.(data)
      }
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.MODULE_CREATE)
    },
  })

  const doCreateModuleUrl = useDebouncedCallback(mutateAsync)

  return { doCreateModuleUrl, isPending, isSuccess }
}

export const useModuleCreate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async ({values, detail}) => {
      const [baseUrl, queryParams] = detail?.url.split("?")
      const parsedUrl = new URL(detail?.url)
      const queryparams = new URLSearchParams(parsedUrl?.search);
      const sv = queryparams?.get('sv');
      
      if(values.singlefile && values.singlefile.status !== "removed"){
        const response = await Axios.put(
          buildApiURL(API.MODULE.CREATEUPLOAD, { baseUrl: baseUrl,module_upload_id: detail.module_upload_id, architecture: "single", queryParams: queryParams }),
          values.singlefile,
          {
            headers: {
              "content-type": "application/x-tar",
              "x-ms-version": sv,
              "x-ms-blob-type": "BlockBlob",
              "x-ms-date": new Date().toUTCString(),
            },
            timeout: 1800000, // 1800s
          },
        )
      } else {
        const response = await Axios.put(
          buildApiURL(API.MODULE.CREATEUPLOAD, { baseUrl: baseUrl,module_upload_id: detail.module_upload_id, architecture: "arm64", queryParams: queryParams }),
          values.arm64file,
          {
            headers: {
              "content-type": "application/x-tar",
              "x-ms-version": sv,
              "x-ms-blob-type": "BlockBlob",
              "x-ms-date": new Date().toUTCString(),
            },
            timeout: 1800000, // 1800s
          },
        )
        if(response.status_code === 201){
          const response_1 = await Axios.put(
            buildApiURL(API.MODULE.CREATEUPLOAD, { baseUrl: baseUrl,module_upload_id: sasUrlDetail.module_upload_id, architecture: "amd64", queryParams: queryParams }),
            values.amd64file,
            {
              headers: {
                "content-type": "application/x-tar",
                "x-ms-version": sv,
                "x-ms-blob-type": "BlockBlob",
                "x-ms-date": new Date().toUTCString(),
              },
              timeout: 1800000, // 1800s
            },
          )
          return response_1
        }
      }
    },
    onSuccess: async ({ data }) => {
      if (data.status_code === 201) {
        await queryClient.refetchQueries({
          queryKey: [MODULE_LIST_KEY, organizationId, false],
        })
        const list = queryClient.getQueryData([MODULE_LIST_KEY, organizationId, false])
        const newModule = list?.modules.find((module) => module.id === data.id) || null
        onSuccess?.(newModule)
      }
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.MODULE_CREATE)
    },
  })

  const doCreateModule = useDebouncedCallback(mutateAsync)

  return { doCreateModule, isPending, isSuccess }
}

export const useModuleUpdateUrl = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ id: moduleId, ...params }) => {

      if((!params.singlefile || params.singlefile.status == "removed") && (!params.arm64file | params.arm64file.status == "removed") && (!params.amd64file && params.amd64file.status == "removed")){
        const payload = {
          name: params.name,
          description: params.description,
        }
        const response = await Axios.put(
          buildApiURL(API.MODULE.UPDATEURL, { organization_id: organizationId, module_id: moduleId }),
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 1800000, // 1800s
          }
        )
        return response
      }
      const payload = {
        name: params.name,
        description: params.description,
        tag: params.tag,
        architectures: params.singlefile && params.singlefile.status !== "removed" ? {} : {
          arm64: true, amd64: true
        }
      }
      if(params.singlefile && params.singlefile.status !== "removed"){
        const response = await Axios.put(
          buildApiURL(API.MODULE.UPDATEURL, { organization_id: organizationId, module_id: moduleId }),
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 1800000, // 1800s
          }
        )
        return response
      }
      const response = await Axios.put(
        buildApiURL(API.MODULE.UPDATEURL, { organization_id: organizationId, module_id: moduleId }),
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
        onSuccess?.(data)
      }
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.MODULE_CREATE)
    },
  })

  const doUpdateModuleUrl = useDebouncedCallback(mutate)

  return { doUpdateModuleUrl, isPending, isSuccess }
}

export const useModuleUpdate = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ id: moduleId, ...params }, sasUrlDetail) => {
      const [baseUrl, queryParams] = sasUrlDetail.url.split("?")
      const parsedUrl = new URL(sasUrlDetail.url)
      const queryparams = new URLSearchParams(parsedUrl.search);
      const sv = queryparams.get('sv');
      if(params.singlefile && params.singlefile.status !== "removed"){
        const response = await Axios.put(
          buildApiURL(API.MODULE.UPDATEUPLOAD, { baseUrl: baseUrl,module_upload_id: sasUrlDetail.module_upload_id, architecture: single, queryParams: queryParams, module_id: moduleId }),
          params.singlefile,
          {
            headers: {
              "content-type": "application/x-tar",
              "content-length": 0,
              "x-ms-version": sv,
              "x-ms-blob-type": "BlockBlob",
              "x-ms-date": date.now()
            },
            timeout: 1800000, // 1800s
          },
        )
      } else {
        const response = await Axios.put(
          buildApiURL(API.MODULE.UPDATEUPLOAD, { baseUrl: baseUrl,module_upload_id: sasUrlDetail.module_upload_id, architecture: arm64, queryParams: queryParams, module_id: moduleId  }),
          params.arm64file,
          {
            headers: {
              "content-type": "application/x-tar",
              "content-length": 0,
              "x-ms-version": sv,
              "x-ms-blob-type": "BlockBlob",
              "x-ms-date": date.now()
            },
            timeout: 1800000, // 1800s
          },
        )
        if(response.status_code === 201){
          const response_1 = await Axios.put(
            buildApiURL(API.MODULE.UPDATEUPLOAD, { baseUrl: baseUrl,module_upload_id: sasUrlDetail.module_upload_id, architecture: amd64, queryParams: queryParams, module_id: moduleId  }),
            params.arm64file,
            {
              headers: {
                "content-type": "application/x-tar",
                "content-length": 0,
                "x-ms-version": sv,
                "x-ms-blob-type": "BlockBlob",
                "x-ms-date": date.now()
              },
              timeout: 1800000, // 1800s
            },
          )
          return response_1
        }
      }
    },
    onSuccess: async (response) => {
      if(response.status_code == 201){
        await queryClient.refetchQueries({
          queryKey: [MODULE_LIST_KEY, organizationId, false],
        })
        onSuccess?.(response)
      }
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.MODULE_UPDATE)
    },
  })

  const doUpdateModule = useDebouncedCallback(mutate)

  return { doUpdateModule, isPending, isSuccess }
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { API, API_ERRORS, USER_LIST_KEY } from '@/constants'
import { useDebouncedCallback } from '@/hooks/share'

import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'

import { useOrganizationQuery } from '../organization'

export const usePermissionAdd = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.post(
        buildApiURL(API.PERMISSION.CREATE, {
          organization_id: organizationId,
          user_id: params?.user_id,
        }),
        params
      )
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([USER_LIST_KEY, organizationId, false])
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.PERMISSION_ADD)
    },
  })

  const doAddPermission = useDebouncedCallback(mutateAsync)

  return { doAddPermission, isPending, isSuccess }
}

export const usePermissionUpdate = ({ userId, organizationUserId, onSuccess } = {}) => {
  const queryClient = useQueryClient()

  const { organizationId } = useOrganizationQuery()

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.put(
        buildApiURL(API.PERMISSION.UPDATE, {
          organization_id: organizationId,
          user_id: userId,
          organization_user_id: organizationUserId,
        }),
        params
      )
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([USER_LIST_KEY, organizationId, false])
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.USER_UPDATE)
    },
  })

  const doUpdatePermission = useDebouncedCallback(mutateAsync)

  return { doUpdatePermission, isPending, isSuccess }
}

export const usePermissionDelete = ({ onSuccess } = {}) => {
  const { organizationId } = useOrganizationQuery()
  const queryClient = useQueryClient()
  const { mutateAsync: doDeletePermissionMutate, isPending, isSuccess } = useMutation({
    mutationFn: async (params) => {
      const response = await Axios.delete(
        buildApiURL(API.PERMISSION.DELETE, {
          organization_id: organizationId,
          user_id: params.user_id,
        }),
        params
      )

      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([USER_LIST_KEY, organizationId, false])
      onSuccess?.(response)
    },
    onError: (error) => {
      showAPIErrorMessage(error, API_ERRORS.USER_DELETE)
    },
  })

  const doDeletePermission = async (params) => {
    await doDeletePermissionMutate(params);
  };

  return { doDeletePermission, isPending, isSuccess }
}

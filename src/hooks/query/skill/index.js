/* eslint-disable no-console */
import { isServer, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { API, API_ERRORS, LOCAL_STORAGE_KEYS, PROJECT_LIST_KEY } from '@/constants'
import { useDebouncedCallback, useSyncLocalStorage } from '@/hooks/share'

import { showAPIErrorMessage } from '@/utils/helper/message'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'

import { useOrganizationQuery } from '../organization'

export const useSkillCreate = ({ onSuccess } = {}) => {
    const { organizationId } = useOrganizationQuery()
    const queryClient = useQueryClient()

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: async (params) => {
            const response = await Axios.post(
                buildApiURL(API.SKILL_CONFIG.CREATE, { organization_id: organizationId }),
                { ...params }
            )
            return response
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries([PROJECT_LIST_KEY, organizationId, false])
            onSuccess?.(response)
        },
        onError: (error) => {
            showAPIErrorMessage(error, API_ERRORS.PROJECT_CREATE)
        },
    })

    const doCreateSkill = useDebouncedCallback(mutate)

    return { doCreateSkill, isPending, isSuccess }
}

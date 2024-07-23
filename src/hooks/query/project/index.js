import { useQuery } from '@tanstack/react-query'

import { API, PROJECT_LIST_KEY } from '@/constants'

import { Axios } from '@/libs/axios'

import { useAuth } from '../auth'

export const useProjectList = () => {
  const { organizationId } = useAuth()

  return useQuery({
    queryKey: [PROJECT_LIST_KEY, organizationId],
    queryFn: async () => {
      const response = await Axios.get(
        API.PROJECT.LIST.replace('{organization_id}', organizationId)
      )
      return response.data
    },
    enabled: !!organizationId,
  })
}

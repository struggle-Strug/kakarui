import { useQuery } from '@tanstack/react-query'

import { API, USER_LIST_KEY } from '@/constants'

import { Axios } from '@/libs/axios'

import { useAuth, useGetMe } from '../auth'

export const useUserList = ({ organizationId } = { organizationId: null }) => {
  const { authenticated, token } = useAuth()
  const { data: me } = useGetMe()
  const id = organizationId || me?.user?.organizations[0]?.organization_id

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [USER_LIST_KEY, id],
    queryFn: async () => {
      const response = await Axios.get(API.USER.BY_ORGANIZATION.replace('{organization_id}', id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    },
    enabled: Boolean(authenticated, token, id),
    keepPreviousData: false,
    cacheTime: 0,
  })
}

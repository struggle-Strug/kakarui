import { useQuery } from '@tanstack/react-query'

import { USER_LIST_KEY } from '@/constants'

import data from '@/services/mock-data/user'

export const useUserList = () => {
  return useQuery({
    queryKey: [USER_LIST_KEY],
    queryFn: async () => {
      // const response = await Axios.get(API.PROJECT.LIST)
      return data
    },
  })
}

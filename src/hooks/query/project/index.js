import { useQuery } from '@tanstack/react-query'

import { PROJECT_LIST_KEY } from '@/constants'

import data from '@/services/mock-data/project'

export const useProjectList = () => {
  return useQuery({
    queryKey: [PROJECT_LIST_KEY],
    queryFn: async () => {
      // const response = await Axios.get(API.PROJECT.LIST)
      return data
    },
  })
}

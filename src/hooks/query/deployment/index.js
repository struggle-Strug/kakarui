import { useQuery } from '@tanstack/react-query'

import { DEPLOYMENT_LIST_KEY } from '@/constants'

import data from '@/services/mock-data/deployment'

export const useDeploymentList = () => {
  return useQuery({
    queryKey: [DEPLOYMENT_LIST_KEY],
    queryFn: async () => {
      // const response = await Axios.get(API.DEPLOY.LIST)
      return data
    },
  })
}

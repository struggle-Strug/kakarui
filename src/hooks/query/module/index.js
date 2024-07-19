import { useQuery } from '@tanstack/react-query'

import { MODULE_CONFIG_LIST_KEY } from '@/constants'

import data from '@/services/placeholder-data/module_config.json'

export const useModuleConfigList = () => {
  return useQuery({
    queryKey: [MODULE_CONFIG_LIST_KEY],
    queryFn: async () => {
      // const response = await Axios.get(API.PROJECT.LIST)
      return data?.module_configs || []
    },
  })
}

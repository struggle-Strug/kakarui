import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useModuleConfigQuery } from '@/hooks/query'

import {
  ModuleConfigAddButton,
  ModuleConfigSearchBox,
  ModuleConfigTable,
} from '@/components/module_config'
import { Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleConfigContainer = () => {
  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading } = useModuleConfigQuery({ sort, search })

  const searchOptions = getSearchOptions(data, ['name', 'description'])

  return (
    <Container title="モジュール配置管理">
      <div className="flex-between mb-5">
        <ModuleConfigSearchBox options={searchOptions} />
        <ModuleConfigAddButton />
      </div>

      <ModuleConfigTable loading={isLoading} total={filteredData.length} data={filteredData} />
    </Container>
  )
}

export default ModuleConfigContainer

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useModuleSetQuery } from '@/hooks/query'

import { ModuleSetAddButton, ModuleSetSearchBox, ModuleSetTable } from '@/components/module_set'
import { Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleSetContainer = () => {
  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching } = useModuleSetQuery({ search, sort })

  const searchOptions = getSearchOptions(data, ['name'])

  return (
    <Container title="モジュールセット管理">
      <div className="flex-between mb-5">
        <ModuleSetSearchBox options={searchOptions} />
        <ModuleSetAddButton label="" />
      </div>

      <ModuleSetTable
        data={filteredData}
        loading={isLoading || isFetching}
        total={filteredData.length}
      />
    </Container>
  )
}

export default ModuleSetContainer

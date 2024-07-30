import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useModuleQuery } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { SearchBar } from '@/components/layout/dashboard'
import { ModuleAddEditModalButton, ModuleTable } from '@/components/module'
import { Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleContainer = () => {
  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching, refetch } = useModuleQuery({ search, sort })

  const searchOptions = getSearchOptions(data, ['name'])

  const onRefetch = useDebouncedCallback(refetch)

  return (
    <Container title="モジュール管理">
      <div className="flex-between mb-5">
        <div className="w-full">
          <SearchBar placeholder="モジュールセット名・説明" options={searchOptions} />
        </div>
        <ModuleAddEditModalButton label="モジュール登録" data={null} onSuccess={onRefetch} />
      </div>

      <ModuleTable
        data={filteredData}
        loading={isLoading || isFetching}
        total={filteredData.length}
      />
    </Container>
  )
}

export default ModuleContainer

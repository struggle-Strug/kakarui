import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import moduleApiStub from '@/hooks/stub/module'

import { ModuleAddEditModalButton, ModuleSearchBox, ModuleTable } from '@/components/module'
import { Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleContainer = () => {
  const [modules, setModule] = useState([])

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  useEffect(() => {
    moduleApiStub.getModule(filter, sort, search).then(setModule)
  }, [filter, sort, search])

  const searchOptions = getSearchOptions(moduleApiStub.getRawData(), ['name', 'description'])

  return (
    <Container title="モジュール管理">
      <div className="flex-between mb-5">
        <ModuleSearchBox options={searchOptions} />
        <ModuleAddEditModalButton label="モジュール登録" />
      </div>

      <ModuleTable data={modules} loading={false} total={modules.length} />
    </Container>
  )
}

export default ModuleContainer

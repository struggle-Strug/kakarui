import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import moduleApiStub from '@/hooks/stub/module'

import { ModuleAddEditModalButton, ModuleSearchBox, ModuleTable } from '@/components/module'
import { Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper'

const ModuleContainer = () => {
  const [modules, setModule] = useState([])

  const [query] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  const onAddModuleSuccess = () => {
    moduleApiStub.getModule(undefined, sort).then(setModule)
  }

  const reload = () => {
    moduleApiStub.getModule(filter, sort, search).then(setModule)
  }

  useEffect(() => {
    reload()
  }, [filter, sort, search])

  return (
    <Container title="モジュール管理">
      <div className="flex-between mb-5">
        <ModuleSearchBox options={getSearchOptions(modules, ['name', 'description'])} />
        <ModuleAddEditModalButton label="モジュール登録" onSuccess={onAddModuleSuccess} />
      </div>

      <ModuleTable data={modules} pagination={{}} loading={false} total={modules} reload={reload} />
    </Container>
  )
}

export default ModuleContainer

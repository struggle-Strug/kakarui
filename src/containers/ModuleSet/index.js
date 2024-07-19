import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import moduleSetApiStub from '@/hooks/stub/module_set'

import { ModuleSetAddButton, ModuleSetSearchBox, ModuleSetTable } from '@/components/module_set'
import { Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper'

const ModuleSetContainer = () => {
  const [moduleSets, setModuleSets] = useState([])

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  useEffect(() => {
    moduleSetApiStub.getModuleSet(filter, sort, search).then(setModuleSets)
  }, [filter, sort, search])

  const searchOptions = getSearchOptions(moduleSetApiStub.getRawData(), ['name', 'description'])

  return (
    <Container title="モジュールセット管理">
      <div className="flex-between mb-5">
        <ModuleSetSearchBox options={searchOptions} />
        <ModuleSetAddButton label="" />
      </div>

      <ModuleSetTable
        data={moduleSets}
        pagination={{}}
        loading={false}
        total={moduleSets.length + 1}
      />
    </Container>
  )
}

export default ModuleSetContainer

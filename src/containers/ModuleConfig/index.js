import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import moduleConfigApiStub from '@/hooks/stub/module_config'

import {
  ModuleConfigAddButton,
  ModuleConfigSearchBox,
  ModuleConfigTable,
} from '@/components/module_config'
import { Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper'

const ModuleConfigContainer = () => {
  const [modulesConfigs, setModuleConfigs] = useState([])

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  useEffect(() => {
    moduleConfigApiStub.getModuleConfig(filter, sort, search).then(setModuleConfigs)
  }, [filter, sort, search])

  const searchOptions = getSearchOptions(moduleConfigApiStub.getRawData(), ['name', 'description'])

  return (
    <Container title="モジュール配置管理">
      <div className="flex-between mb-5">
        <ModuleConfigSearchBox options={searchOptions} />
        <ModuleConfigAddButton />
      </div>

      <ModuleConfigTable
        data={modulesConfigs}
        pagination={{}}
        loading={false}
        total={modulesConfigs.length + 1}
      />
    </Container>
  )
}

export default ModuleConfigContainer

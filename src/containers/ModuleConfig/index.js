import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import { useLocalStorageDefaultProject } from '@/hooks/custom/useLocalStorageSync'
import moduleConfigApiStub from '@/hooks/stub/module_config'

import { ModuleConfigAddButton, ModuleConfigSearchBox } from '@/components/module_config'
import { ModuleSetTable } from '@/components/module_set'
import { Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleConfigContainer = () => {
  const [project] = useLocalStorageDefaultProject()
  const [modulesConfigs, setModuleConfigs] = useState([])

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  const refreshData = () => {
    moduleConfigApiStub.getModuleConfig(filter, sort, search, project).then(setModuleConfigs)
  }

  useEffect(() => {
    refreshData()
  }, [filter, sort, search, project])

  const searchOptions = getSearchOptions(moduleConfigApiStub.getRawData(), ['name', 'description'])

  return (
    <Container title="モジュール配置管理">
      <div className="flex-between mb-5">
        <ModuleConfigSearchBox options={searchOptions} />
        <ModuleConfigAddButton />
      </div>

      <ModuleSetTable
        data={modulesConfigs}
        pagination={{}}
        // refreshData={refreshData}
        loading={false}
        total={modulesConfigs.length + 1}
      />
    </Container>
  )
}

export default ModuleConfigContainer

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Routes } from '@/constants'
import { useModuleConfigQuery } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { AddIcon } from '@/components/icons'
import { SearchBar } from '@/components/layout/dashboard'
import { ModuleConfigTable } from '@/components/module_config'
import { Button, Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleConfigContainer = () => {
  const router = useRouter()
  const { reload } = router.query

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, refetch } = useModuleConfigQuery({ sort, search })

  const searchOptions = getSearchOptions(data, ['name', 'description'])

  const onRefetch = useDebouncedCallback(refetch)

  useEffect(() => {
    if (reload === 1) {
      onRefetch()
    }
  }, [reload])

  return (
    <Container title="モジュール配置管理">
      <div className="flex-between mb-5">
        <div className="w-full">
          <SearchBar placeholder="モジュール配置名・説明" options={searchOptions} />
        </div>
        <Button
          type="outline"
          icon={<AddIcon size={36} />}
          label="新規モジュール配置作成"
          onClick={() => router.push(Routes.MODULE_CONFIG_CREATE)}
        />
      </div>

      <ModuleConfigTable loading={isLoading} total={filteredData.length} data={filteredData} />
    </Container>
  )
}

export default ModuleConfigContainer

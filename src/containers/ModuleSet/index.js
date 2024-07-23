import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Routes } from '@/constants'
import { useModuleSetQuery } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { AddIcon } from '@/components/icons'
import { SearchBar } from '@/components/layout/dashboard'
import { ModuleSetTable } from '@/components/module_set'
import { Button, Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleSetContainer = () => {
  const router = useRouter()
  const { reload } = router.query

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching } = useModuleSetQuery({ search, sort })

  const searchOptions = getSearchOptions(data, ['name'])

  return (
    <Container title="モジュールセット管理">
      <Head>
        <title>モジュールセット管理</title>
      </Head>
      <div className="flex-between mb-5">
        <div className="w-full">
          <SearchBar placeholder="モジュールセット名・説明" options={searchOptions} />
        </div>
        <Button
          type="outline"
          icon={<AddIcon size={36} />}
          label="新規モジュールセット"
          onClick={() => router.push(Routes.MODULE_SET_CREATE)}
        />
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

import { Space } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useState } from 'react'

import { useModuleQuery } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { AddIcon, EditIcon } from '@/components/icons'
import { SearchBar } from '@/components/layout/dashboard'
import { ModuleForm } from '@/components/module'
import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Button, ButtonIcon, Container, Table } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleContainer = () => {
  const [module, setModule] = useState(null)
  const [moduleFormFlag, setModuleFormFlag] = useState(false)

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching, refetch } = useModuleQuery({ search, sort })

  const searchOptions = getSearchOptions(data, ['name'])

  const onRefetch = useDebouncedCallback(refetch)

  const moduleFormOpen = (newModule) => {
    setModule(newModule)
    setModuleFormFlag(true)
    return false
  }

  const columns = [
    {
      title: <ColumnSorter title="モジュール名" field="name" />,
      dataIndex: 'name',
      className: 'min-w-[220px]',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    },
    {
      title: <ColumnSorter title="タグ" field="latest_tag" />,
      dataIndex: 'latest_tag',
      className: 'min-w-[50px]',
      render: (item) => <RowContent item={item} className="max-w-[50px]" />,
    },
    {
      title: <ColumnSorter title="説明" field="description" />,
      dataIndex: 'description',
      className: 'min-w-[320px]',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    },
    {
      title: <ColumnSorter title="登録日" field="create_date" />,
      dataIndex: 'create_date',
      render: (item) => <RowDate item={item} className="text-base" />,
      className: 'min-w-[100px] w-[120px]',
    },
    {
      title: <ColumnSorter title="更新日" field="update_date" />,
      dataIndex: 'update_date',
      render: (item) => <RowDate item={item} className="text-base" />,
      className: 'min-w-[100px] w-[120px]',
    },
    {
      title: '操作',
      align: 'center',
      render: (record) => (
        <Space>
          <ButtonIcon icon={<EditIcon size={32} />} onClick={() => moduleFormOpen(record)} />
        </Space>
      ),
      className: 'min-w-[100px]',
    },
  ]

  return (
    <Container title="モジュール管理">
      <div className="flex-between mb-5">
        <div className="w-full">
          <SearchBar placeholder="モジュールセット名・説明" options={searchOptions} />
        </div>
        <Button
          icon={<AddIcon size={36} />}
          type="outline"
          label="モジュール登録"
          onClick={() => moduleFormOpen(null)}
        />
      </div>

      <Table
        total={filteredData.length}
        loading={isLoading || isFetching}
        columns={columns}
        data={filteredData}
      />
      <ModuleForm
        open={moduleFormFlag}
        data={module}
        onSuccess={onRefetch}
        onClose={() => setModuleFormFlag(false)}
      />
    </Container>
  )
}

export default ModuleContainer

import { Space } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useState } from 'react'

import { useGetMe, useModuleQuery, useUserActive } from '@/hooks/query'

import { AddIcon, EditIcon, TrashIcon } from '@/components/icons'
import { SearchBar } from '@/components/layout/dashboard'
import { ModuleDeleteForm, ModuleForm } from '@/components/module'
import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Button, ButtonIcon, Container, Table } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleContainer = () => {
  const [module, setModule] = useState(null)
  const [moduleFormFlag, setModuleFormFlag] = useState(false)
  const [moduleDeleteFormFlag, setModuleDeleteFormFlag] = useState(false)
  const { isOrgAdmin, isSystemAdmin } = useGetMe()
  const { userActiveId } = useUserActive()

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching, refetch } = useModuleQuery({ search, sort })

  const searchOptions = getSearchOptions(data, ['name'])

  const moduleFormOpen = (newModule) => {
    const initModule = newModule ? { ...newModule } : null
    setModule(initModule)
    setModuleFormFlag(true)
    return false
  }

  const moduleDeleteFormOpen = (moduleToDelete) => {
    setModule(moduleToDelete)
    setModuleDeleteFormFlag(true)
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
          <ButtonIcon
            icon={<TrashIcon size={32} />}
            onClick={() => moduleDeleteFormOpen(record)}
            disabled={!isSystemAdmin && !isOrgAdmin && record.create_user !== userActiveId}
          />
        </Space>
      ),
      className: 'min-w-[100px]',
    },
  ]

  return (
    <Container title="モジュール管理">
      <div className="flex-between mb-5">
        <div className="w-full">
          <SearchBar placeholder="モジュール名・説明" options={searchOptions} />
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
      <ModuleForm open={moduleFormFlag} data={module} onClose={() => setModuleFormFlag(false)} onRefetch={refetch}/>
      {moduleDeleteFormFlag && (
        <ModuleDeleteForm
          open={moduleDeleteFormFlag}
          data={module}
          onClose={() => setModuleDeleteFormFlag(false)}
        />
      )}
    </Container>
  )
}

export default ModuleContainer

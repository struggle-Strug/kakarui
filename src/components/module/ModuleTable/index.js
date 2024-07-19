/* eslint-disable react/no-unstable-nested-components */
import { Space } from 'antd'

import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Table } from '@/components/ui'

import ModuleAddEditModalButton from '../ModuleAddEditModalButton'

// import ModuleDeleteModalButton from '../ModuleDeleteModalButton'

const ModuleTable = ({ data, total, loading, pagination, reload }) => {
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
      className: 'min-w-[200px]',
    },
    {
      title: <ColumnSorter title="更新日" field="update_date" />,
      dataIndex: 'update_date',
      render: (item) => <RowDate item={item} className="text-base" />,
      className: 'min-w-[200px]',
    },
    {
      title: <span className="text-center text-base">操作</span>,
      align: 'center',
      render: (record) => (
        <Space>
          <ModuleAddEditModalButton isEdit data={record} onSuccess={reload} />
          {/* <ModuleDeleteModalButton {...item} /> */}
        </Space>
      ),
      className: 'min-w-[150px]',
    },
  ]

  return (
    <Table
      total={total}
      pagination={pagination}
      loading={loading}
      columns={columns}
      data={data}
      hasEmpty
    />
  )
}

export default ModuleTable

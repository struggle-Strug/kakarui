import { useState } from 'react'

import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Table } from '@/components/ui'

const ModuleSetSelectionTableForm = ({ data }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const columns = [
    {
      title: <ColumnSorter title={<span> モジュールセット名</span>} field="name" />,
      dataIndex: 'name',
      className: 'min-w-[248px]',
      render: (text) => (
        <div className="flex w-[248px] cursor-pointer items-center gap-x-4 text-base">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: <ColumnSorter title="説明" field="description" />,
      dataIndex: 'description',
      className: 'min-w-[440px]',
      render: (item) => <RowContent item={item} className="max-w-[440px]" />,
    },
    {
      title: <ColumnSorter title="登録日" field="create_date" />,
      dataIndex: 'create_date',
      className: 'min-w-[124px]',
      render: (text) => <RowDate item={text} />,
    },
    {
      title: <ColumnSorter title="更新日" field="update_date" />,
      dataIndex: 'update_date',
      className: 'min-w-[124px]',
      render: (text) => <RowDate item={text} />,
    },
  ]

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Table
      rowSelection={rowSelection}
      pagination={{ defaultPageSize: 10 }}
      columns={columns}
      data={data}
    />
  )
}

export default ModuleSetSelectionTableForm

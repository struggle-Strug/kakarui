import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Table } from '@/components/ui'

const ModuleSetSelectionTableForm = ({ data, loading, total, setSelected }) => {
  const columns = [
    {
      title: <ColumnSorter title="モジュールセット名" field="name" />,
      dataIndex: 'name',
      className: 'min-w-[248px]',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
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

  const onSelectChange = (newSelected) => {
    setSelected(newSelected)
  }

  const rowSelection = {
    type: 'radio',
    onSelect: onSelectChange,
  }

  return (
    <Table
      rowSelection={rowSelection}
      total={total}
      pagination={{ defaultPageSize: 30 }}
      loading={loading}
      columns={columns}
      data={data}
    />
  )
}

export default ModuleSetSelectionTableForm

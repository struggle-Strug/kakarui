import { ColumnSorter } from '@/components/table'
import { InputTextArea, Table } from '@/components/ui'

const ModuleSettingTableForm = ({ data }) => {
  const columns = [
    {
      title: <ColumnSorter title={<span>プロパティ</span>} field="property" />,
      dataIndex: 'property',
      className: 'min-w-[248px]',
      render: (text) => <div className="text-base">{text}</div>,
    },
    {
      title: <ColumnSorter title="設定" field="settings" />,
      dataIndex: 'settings',
      className: 'min-w-[440px]',
      render: (value) => <InputTextArea value={value} />,
    },
  ]

  return (
    <Table
      pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
      columns={columns}
      data={data}
    />
  )
}

export default ModuleSettingTableForm

import { Space } from 'antd'

import { Routes } from '@/constants'

import { EditIcon } from '@/components/icons'
import { ColumnSorter, RowContent, RowDate, RowTextLink } from '@/components/table'
import { ButtonIcon, Table } from '@/components/ui'

const ModuleSetTable = ({ data, total, loading }) => {
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
    {
      title: <span className="text-base">操作</span>,
      dataIndex: 'id',
      render: (id) => (
        <Space>
          <RowTextLink
            pathname={Routes.MODULE_SET_DETAIL}
            query={{ module_set_id: id }}
            disabled={!id}
          >
            <ButtonIcon icon={<EditIcon size={32} />} />
          </RowTextLink>
        </Space>
      ),
    },
  ]

  return (
    <Table
      total={total}
      pagination={{ defaultPageSize: 30 }}
      loading={loading}
      columns={columns}
      data={data}
    />
  )
}

export default ModuleSetTable

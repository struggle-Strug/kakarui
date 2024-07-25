import { Space } from 'antd'

import { USER_ROLE_TEXT } from '@/constants'

import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Table } from '@/components/ui'

import UserUpdateModalButton from '../UserUpdateModalButton'

const UserTable = ({ data, total, loading, reload }) => {
  const columns = [
    {
      title: <ColumnSorter title="会社名" field="company" />,
      dataIndex: 'company',
      className: 'min-w-[164px]',
      render: (item) => <RowContent className="max-w-[320px]" item={item} />,
    },
    {
      title: <ColumnSorter title="氏名" field="name" />,
      dataIndex: 'name',
      className: 'min-w-[124px]',
      render: (item) => <RowContent className="max-w-[200px]" item={item} />,
    },
    {
      title: <ColumnSorter title="メールアドレス" field="mail" />,
      dataIndex: 'mail',
      className: 'min-w-[124px]',
      render: (item) => <RowContent className="max-w-[320px]" item={item} />,
    },
    {
      title: <ColumnSorter title="ロール" field="main_role" />,
      dataIndex: 'main_role',
      className: 'min-w-[112px]',
      render: (item) => <RowContent item={USER_ROLE_TEXT[item] || ''} />,
    },
    {
      title: <ColumnSorter title="ステータス" field="enable" />,
      dataIndex: 'enable',
      align: 'center',
      className: 'min-w-[112px]',
      render: (enable) => <RowContent item={enable ? '有効' : '無効'} />,
    },
    {
      title: <ColumnSorter title="登録日" field="create_date" />,
      dataIndex: 'create_date',
      render: (item) => <RowDate item={item} className="text-base" />,
      className: 'min-w-[124px]',
    },
    {
      title: <span className="text-base">操作</span>,
      render: (record) => (
        <Space>
          <UserUpdateModalButton data={record} onSuccess={reload} />
        </Space>
      ),
    },
  ]

  return (
    <Table
      total={total}
      pagination={{ defaultPageSize: 10 }}
      loading={loading}
      columns={columns}
      data={data}
    />
  )
}

export default UserTable

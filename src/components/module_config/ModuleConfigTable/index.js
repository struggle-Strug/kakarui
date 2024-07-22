/* eslint-disable camelcase */
import { Space } from 'antd'

import { Routes } from '@/constants'

import { DeployAddEditModal } from '@/components/deployment'
import { DeployIcon, EditIcon } from '@/components/icons'
import { ColumnSorter, RowContent, RowDate, RowTextLink } from '@/components/table'
import { ButtonIcon, Table } from '@/components/ui'

const ModuleConfigTable = ({ data, total, loading, pagination }) => {
  const columns = [
    {
      title: <ColumnSorter title="モジュール配置名" field="name" />,
      dataIndex: 'name',
      className: 'min-w-[124px]',
      render: (item, { id }) => (
        <RowTextLink
          pathname={Routes.MODULE_CONFIG_DETAIL}
          query={{ module_config_id: id }}
          disabled={!id}
        >
          <RowContent item={item} />
        </RowTextLink>
      ),
    },
    {
      title: <ColumnSorter title="説明" field="description" />,
      dataIndex: 'description',
      className: 'min-w-[400px]',
      render: (item) => <RowContent item={item} className="max-w-[500px]" />,
    },
    {
      title: <ColumnSorter title="登録日" field="create_date" />,
      dataIndex: 'create_date',
      className: 'min-w-[200px]',
      render: (item) => <RowDate item={item} className="text-base" />,
    },
    {
      title: <ColumnSorter title="更新日" field="update_date" />,
      dataIndex: 'update_date',
      className: 'min-w-[200px]',
      render: (item) => <RowDate item={item} className="text-base" />,
    },
    {
      title: <span className="text-base">操作</span>,
      dataIndex: 'id',
      render: (id, row) => (
        <Space>
          <RowTextLink
            pathname={Routes.MODULE_CONFIG_DETAIL}
            query={{ module_config_id: id }}
            disabled={!id}
          >
            <ButtonIcon icon={<EditIcon size={32} />} onClick={() => {}} />
          </RowTextLink>

          <DeployAddEditModal isEdit data={row} onSuccess={() => {}}>
            <ButtonIcon icon={<DeployIcon size={32} />} onClick={() => {}} />
          </DeployAddEditModal>
        </Space>
      ),
      className: 'min-w-[150px]',
    },
  ]

  return (
    <Table total={total} pagination={pagination} loading={loading} columns={columns} data={data} />
  )
}

export default ModuleConfigTable

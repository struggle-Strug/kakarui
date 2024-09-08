/* eslint-disable camelcase */
import { Space } from 'antd'
import noop from 'lodash/noop'

import { Routes } from '@/constants'
import { useGetMe, useUserActive } from '@/hooks/query'

import { DeployAddEditModal } from '@/components/deployment'
import { DeleteIcon, DeployIcon, EditIcon } from '@/components/icons'
import { ColumnSorter, RowContent, RowDate, RowTextLink } from '@/components/table'
import { ButtonIcon, Table } from '@/components/ui'

const ModuleConfigTable = ({ data, total, loading }) => {
  const { isSystemAdmin, isOrgAdmin } = useGetMe()
  const { userActiveId } = useUserActive()

  const columns = [
    {
      title: <ColumnSorter title="モジュール配置名" field="name" />,
      dataIndex: 'name',
      className: 'min-w-[164px]',
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
      className: 'min-w-[164px]',
      render: (item) => <RowDate item={item} />,
    },
    {
      title: <ColumnSorter title="更新日" field="update_date" />,
      dataIndex: 'update_date',
      className: 'min-w-[164px]',
      render: (item) => <RowDate item={item} />,
    },
    {
      title: <span className="text-center">操作</span>,
      dataIndex: 'id',
      align: 'center',
      render: (id, row) => (
        <Space>
          <RowTextLink
            pathname={Routes.MODULE_CONFIG_DETAIL}
            query={{ module_config_id: id }}
            disabled={!id}
          >
            <ButtonIcon icon={<EditIcon size={32} />} onClick={noop} />
          </RowTextLink>

          <DeployAddEditModal isEdit data={row}>
            <ButtonIcon icon={<DeployIcon size={32} />} onClick={noop} />
          </DeployAddEditModal>

          <RowTextLink
            pathname={Routes.MODULE_CONFIG_DELETE}
            query={{ module_config_id: id }}
            disabled={!id || (!isSystemAdmin && !isOrgAdmin && row.create_user !== userActiveId)}
          >
            <ButtonIcon
              icon={<DeleteIcon size={32} />}
              onClick={noop}
              disabled={!id || (!isSystemAdmin && !isOrgAdmin && row.create_user !== userActiveId)}
            />
          </RowTextLink>
        </Space>
      ),
      className: 'min-w-[150px]',
    },
  ]

  return <Table total={total} pagination={{}} loading={loading} columns={columns} data={data} />
}

export default ModuleConfigTable

/* eslint-disable camelcase */
import { Space } from 'antd'
import noop from 'lodash/noop'

import { Routes } from '@/constants'
import { useGetMe, useUserActive } from '@/hooks/query'

import { DeployAddEditModal } from '@/components/deployment'
import { DeleteIcon, DeployIcon, EditIcon } from '@/components/icons'
import { ColumnSorter, RowContent, RowDate, RowTextLink } from '@/components/table'
import { ButtonIcon, Table } from '@/components/ui'

const SkillConfigTable = ({ data, total, loading }) => {
  const { isSystemAdmin, isOrgAdmin } = useGetMe()
  const { userActiveId } = useUserActive()

  const columns = [
    {
      title: <ColumnSorter title="モジュール名" field="name" />,
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
      title: <ColumnSorter title="スキル名" field="description" />,
      dataIndex: 'description',
      className: 'min-w-[164px]',
      render: (item) => <RowContent item={item} className="max-w-[500px]" />,
    },
    {
      title: <ColumnSorter title="スキル説明" field="create_date" />,
      dataIndex: 'create_date',
      className: 'min-w-[400px]',
      render: (item) => <RowDate item={item} />,
    },
    {
      title: <ColumnSorter title="スキーマ" field="text" />,
      dataIndex: 'update_date',
      className: 'min-w-[164px]',
      render: (item) => <RowDate item={item} />,
    },
    {
      title: <ColumnSorter title="参照範囲" field="text" />,
      dataIndex: 'update_date',
      className: 'min-w-[164px]',
      render: (item) => <RowDate item={item} />,
    },
    {
      title: <ColumnSorter title="更新者" field="name" />,
      dataIndex: 'update_date',
      className: 'min-w-[110px]',
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
      className: 'max-w-[120px]',
      align: 'center',
      render: (id, row) => (
        <Space>

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

export default SkillConfigTable

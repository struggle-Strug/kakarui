import { Space } from 'antd'
import noop from 'lodash/noop'

import { Routes } from '@/constants'
import { useGetMe, useUserActive } from '@/hooks/query'

import { DeleteIcon, EditIcon } from '@/components/icons'
import { ColumnSorter, RowContent, RowDate, RowTextLink } from '@/components/table'
import { ButtonIcon, Table } from '@/components/ui'

const ModuleSetTable = ({ data, total, loading }) => {
  const { isSystemAdmin, isOrgAdmin } = useGetMe()
  const { userActiveId } = useUserActive()

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
      render: (id, row) => (
        <Space>
          <RowTextLink
            pathname={Routes.MODULE_SET_DETAIL}
            query={{ module_set_id: id }}
            disabled={!id}
          >
            <ButtonIcon icon={<EditIcon size={32} />} onClick={noop} />
          </RowTextLink>

          <RowTextLink
            pathname={Routes.MODULE_SET_DELETE}
            query={{ module_set_id: id }}
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
    },
  ]

  return <Table total={total} loading={loading} columns={columns} data={data} />
}

export default ModuleSetTable

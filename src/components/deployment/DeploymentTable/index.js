import { DEPLOYMENT_TYPE_TEXT, FORMAT_STRING, Routes } from '@/constants'

import { PlayIcon } from '@/components/icons'
import { ColumnSorter, DeployStatus, RowContent, RowDate } from '@/components/table'
import { Link, Table } from '@/components/ui'

const DeploymentTable = ({ data, total, loading, pagination }) => {
  const columns = [
    {
      title: <ColumnSorter title="日付" field="create_date" />,
      dataIndex: 'create_date',
      render: (item) => (
        <RowDate item={item} className="text-base" unit={FORMAT_STRING.datetime_full_str} />
      ),
    },
    {
      title: <ColumnSorter title="モジュール配置名" field="module_config_name" />,
      dataIndex: 'module_config_name',
      className: 'min-w-[220px]',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    },
    {
      title: <ColumnSorter title="デプロイ先" field="type" />,
      dataIndex: 'type',
      render: (item) => <RowContent item={DEPLOYMENT_TYPE_TEXT[item] || ''} />,
    },
    {
      title: <ColumnSorter title="ステータス" field="status" />,
      dataIndex: 'status',
      className: 'min-w-[100px]',
      render: (item) => <DeployStatus status={item} />,
    },
    {
      title: <ColumnSorter title="ムービー" field="execute_result_url" />,
      key: 'url',
      render: (item) =>
        item.execute_result_url && item.status === 'Complete' ? (
          <Link
            href={Routes.DEPLOY_MOVIE_SHOW_DETAIL.replace('[deploy_id]', item.id)}
            className="flex justify-center"
          >
            <PlayIcon size={30} />
          </Link>
        ) : (
          <div />
        ),
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

export default DeploymentTable

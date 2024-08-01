import { DEPLOYMENT_TYPE_TEXT, DEPLOY_STATUS, FORMAT_STRING } from '@/constants'

import { ThumbnailLink } from '@/components/common'
import { ColumnSorter, DeployStatus, RowContent, RowDate } from '@/components/table'
import { Table } from '@/components/ui'

const DeploymentTable = ({ data, total, loading }) => {
  const columns = [
    {
      title: <ColumnSorter title="日付" field="create_date" />,
      dataIndex: 'create_date',
      render: (item) => (
        <RowDate item={item} className="min-w-[240px]" unit={FORMAT_STRING.datetime_full_str} />
      ),
    },
    {
      title: <ColumnSorter title="モジュール配置名" field="module_config_name" />,
      dataIndex: 'module_config_name',
      width: '60%',
      render: (item) => <RowContent item={item} className="min-w-[240px] max-w-[400px]" />,
    },
    {
      title: <ColumnSorter title="デプロイ先" field="type" />,
      dataIndex: 'type',
      render: (item) => (
        <RowContent className="min-w-[132px]" item={DEPLOYMENT_TYPE_TEXT[item] || ''} />
      ),
    },
    {
      title: <ColumnSorter title="ステータス" field="status" />,
      dataIndex: 'status',
      render: (item) => <DeployStatus className="min-w-[154px]" status={item} />,
    },
    {
      title: <ColumnSorter title="ムービー" field="execute_result_url" />,
      className: 'min-w-[154px]',
      render: (item, _, index) => {
        const isCompletedStatus = item?.status === DEPLOY_STATUS.COMPLETE

        if (!isCompletedStatus || !item?.execute_result_url)
          return <div className="h-[84px] min-w-[154px]" />

        return <ThumbnailLink deployId={item?.id} projectId={item?.project_id} index={index} />
      },
    },
  ]

  return <Table total={total} pagination={{}} loading={loading} columns={columns} data={data} />
}

export default DeploymentTable

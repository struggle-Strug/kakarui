import { DEPLOYMENT_TYPE_TEXT, FORMAT_STRING } from '@/constants'

import { ColumnSorter, DeployStatus, RowContent, RowDate } from '@/components/table'
import { Table } from '@/components/ui'

import DeployLastDesiredStatus from '../DeployLastDesiredStatus'
import DeployThumbnailLink from '../DeployThumbnailLink'
import RowLogFileLink from '../RowLogFileLink'

const DeploymentTable = ({ data, total, loading }) => {
  const columns = [
    {
      title: <ColumnSorter title="実施日時" field="execute_start_date" />,
      dataIndex: 'execute_start_date',
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
      title: <ColumnSorter title="担当者" field="update_user_name" />,
      dataIndex: 'update_user_name',
      render: (item) => <RowContent item={item} className="min-w-[154px]" />,
    },
    {
      title: <ColumnSorter title="メッセージ" field="last_desired_status.status" />,
      dataIndex: 'last_desired_status',
      render: (item, { id }) => {
        return <DeployLastDesiredStatus id={id} item={item} />
      },
    },

    {
      title: <ColumnSorter title="詳細表示" field="deploy_log_file_name" />,
      render: (item) => <RowLogFileLink item={item} />,
    },
    {
      title: <ColumnSorter title="ムービー" field="sim_video_thumbnail" />,
      className: 'min-w-[154px]',
      dataIndex: 'sim_video_thumbnail',
      render: (thumbnail, item) => <DeployThumbnailLink item={item} />,
    },
  ]

  return <Table total={total} pagination={{}} loading={loading} columns={columns} data={data} />
}

export default DeploymentTable
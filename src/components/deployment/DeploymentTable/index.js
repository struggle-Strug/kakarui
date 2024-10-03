import { Space } from 'antd'
import noop from 'lodash/noop'

import { DEPLOYMENT_TYPE_TEXT, DEPLOY_STATUS, FORMAT_STRING, Routes } from '@/constants'

import { ThumbnailLink } from '@/components/common'
import { LogIcon } from '@/components/icons'
import { ColumnSorter, DeployStatus, RowContent, RowDate, RowTextLink } from '@/components/table'
import { ButtonIcon, Table } from '@/components/ui'

import { base64ToImageUrl } from '@/utils/helper/image'

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
      title: <ColumnSorter title="完了日時" field="execute_start_date" />,
      dataIndex: 'execute_end_date',
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
      title: <div className="min-w-[132px]">メッセージ</div>,
      dataIndex: 'last_desired_status',
      render: (item) => {
        const { code, description } = item || {}
        if (code !== 500) return ''
        return <RowContent item={description} showTooltip />
      },
    },

    {
      title: <div className="min-w-[132px] text-center">ログ表示</div>,
      render: (item) => {
        const { id: deployId, project_id: projectId, deploy_log_file_name: logName } = item || {}

        const disabled = Boolean(!deployId || !projectId || !logName)

        if (!logName) return null

        return (
          <RowTextLink
            pathname={Routes.DEPLOY_LOG_SHOW_DETAIL}
            query={{ deploy_id: deployId, project_id: projectId, name: logName }}
            disabled={disabled}
          >
            <Space className="flex-center">
              <ButtonIcon icon={<LogIcon size={32} />} onClick={noop} disabled={disabled} />
            </Space>
          </RowTextLink>
        )
      },
    },
    {
      title: <ColumnSorter title="ムービー" field="sim_video_thumbnail" />,
      className: 'min-w-[154px]',
      dataIndex: 'sim_video_thumbnail',
      render: (thumbnail, item, index) => {
        const isCompletedStatus = item?.status === DEPLOY_STATUS.COMPLETE

        if (!isCompletedStatus || !thumbnail) return <div className="h-[84px] min-w-[154px]" />

        return (
          <ThumbnailLink
            deployId={item?.id}
            projectId={item?.project_id}
            thumbnailUrl={base64ToImageUrl(thumbnail)}
            index={index}
          />
        )
      },
    },
  ]

  return <Table total={total} pagination={{}} loading={loading} columns={columns} data={data} />
}

export default DeploymentTable

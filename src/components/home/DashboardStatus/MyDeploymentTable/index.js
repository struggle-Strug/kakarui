import { DEPLOYMENT_TYPE_TEXT, DEPLOY_STATUS, FORMAT_STRING, Routes } from '@/constants'

import { ThumbnailLink } from '@/components/common'
import { DeployStatus, RowContent, RowDate, RowTextLink } from '@/components/table'
import { Link, Table } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const HeaderRow = (props) => {
  return <tr {...props} />
}

const BodyRow = (props) => {
  return <tr {...props} />
}

const HeaderCell = (props) => {
  return (
    <th
      {...props}
      className={cn(
        '!rounded-none !border-x-0 !border-b !border-t-0 !border-dark-gray-3 !bg-transparent !pl-0 text-base before:!bg-transparent',
        props?.className
      )}
    />
  )
}

const BodyCell = (props) => {
  return (
    <td
      {...props}
      className={cn(
        '!rounded-none !border-x-0 !border-b !border-t-0 !border-dark-gray-3 !bg-transparent !pl-0 text-base',
        props?.className
      )}
    />
  )
}

const DeployShowMore = () => (
  <div className="absolute bottom-4 right-16 w-full max-w-max">
    <Link
      href={Routes.DEPLOY}
      className="inline text-nowrap text-base text-indigo-rainbow transition-opacity hover:opacity-75"
    >
      もっと見る…
    </Link>
  </div>
)

const MyDeploymentTable = ({ data, total, loading }) => {
  const columns = [
    {
      title: <div className="min-w-[232px]">日付</div>,
      dataIndex: 'create_date',
      render: (item) => (
        <RowDate className="min-w-[232px]" item={item} unit={FORMAT_STRING.datetime_full_str} />
      ),
    },
    {
      title: <div className="min-w-[200px]">プロジェクト</div>,
      dataIndex: 'project_name',
      render: (item) => <RowContent item={item} className="min-w-[200px] max-w-[400px]" />,
    },
    {
      title: <div className="min-w-[240px]">モジュール配置</div>,
      dataIndex: 'module_config_name',
      width: '60%',
      render: (item, row) => (
        <RowTextLink
          pathname={Routes.MODULE_CONFIG_DETAIL}
          query={{ module_config_id: row?.module_config_id }}
          disabled={!row?.module_config_id}
        >
          <RowContent item={item} className="min-w-[240px] max-w-[400px]" />
        </RowTextLink>
      ),
    },
    {
      title: <div className="min-w-[132px]">デプロイタイプ</div>,
      dataIndex: 'type',
      render: (item) => (
        <RowContent className="min-w-[132px]" item={DEPLOYMENT_TYPE_TEXT[item] || ''} />
      ),
    },
    {
      title: <div className="min-w-[132px]">ステータス</div>,
      dataIndex: 'status',
      render: (item) => <DeployStatus className="min-w-[132px]" status={item} />,
    },
    {
      title: <div className="min-w-[100px]">ムービー</div>,
      className: 'min-w-[100px]',
      render: (item) => {
        const isCompletedStatus = item?.status === DEPLOY_STATUS.COMPLETE

        // data có cái nào có "execute_result_url" đâu =))
        if (!isCompletedStatus || !item?.execute_result_url) return <div className="h-[84px]" />

        return <ThumbnailLink itemId={item?.id} />
      },
    },
  ]

  const components = {
    header: {
      cell: HeaderCell,
      row: HeaderRow,
    },
    body: {
      cell: BodyCell,
      row: BodyRow,
    },
  }

  return (
    <section className="relative rounded-[20px] border border-solid border-dark-gray-3 px-9 pb-10 pt-4">
      <Table
        data={data}
        total={total}
        loading={loading}
        components={components}
        columns={columns}
        pagination={false}
        bordered={false}
      />
      {!loading && data.length > 0 ? <DeployShowMore /> : null}
    </section>
  )
}

export default MyDeploymentTable

import { useRouter } from 'next/router'

import { DEPLOYMENT_TYPE_TEXT, DEPLOY_STATUS, FORMAT_STRING, Routes } from '@/constants'
import { useModuleConfigQuery, useProjectActive, useProjectQuery } from '@/hooks/query'

import { ThumbnailLink } from '@/components/common'
import { DeployStatus, RowContent, RowDate } from '@/components/table'
import { Button, Link, Table } from '@/components/ui'

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
  const router = useRouter()
  const { filteredData: projectFilteredData } = useProjectQuery({
    sort: JSON.stringify([{ field: 'create_date', value: 'desc' }]),
  })
  const { refetch: moduleConfigRefetch } = useModuleConfigQuery({
    sort: JSON.stringify([{ field: 'create_date', value: 'desc' }]),
  })
  const { setProjectActive } = useProjectActive()

  const onClick = (module) => {
    if (!module?.module_config_id) return
    const moduleProject = projectFilteredData.find((project) => project.id === module.project_id)
    if (moduleProject) {
      setProjectActive(moduleProject)
      moduleConfigRefetch().then(() => {
        router.push(`/moduleconfig-manage/${module.module_config_id}`)
      })
    }
  }

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
        <Button
          onClick={() => onClick(row)}
          type="text"
          className="flex-start min-w-[240px] max-w-[400px] !p-0"
        >
          {item}
        </Button>
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
      render: (item, _, index) => {
        const isCompletedStatus = item?.status === DEPLOY_STATUS.COMPLETE

        if (!isCompletedStatus || !item?.execute_result_url) return <div className="h-[84px]" />

        return <ThumbnailLink deployId={item?.id} projectId={item?.project_id} index={index} />
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

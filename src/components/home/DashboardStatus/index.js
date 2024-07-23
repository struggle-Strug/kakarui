import dayjs from 'dayjs'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import { DEPLOYMENT_TYPE_TEXT, FORMAT_STRING, Routes } from '@/constants'
import { useLocalStorageDefaultProject } from '@/hooks/custom/useLocalStorageSync'
import deployApiStub from '@/hooks/stub/deploy'

import { PlayIcon, ReloadIcon } from '@/components/icons'
import { HeaderTitle } from '@/components/layout/dashboard'
import { DeployStatus, RowContent, RowDate } from '@/components/table'
import { Button, Link, Table } from '@/components/ui'

import { cn } from '@/utils/helper'

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
        '!rounded-none !border-x-0 !border-b !border-t-0 !border-dark-gray-3 !bg-transparent !pl-0',
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
        '!rounded-none !border-x-0 !border-b !border-t-0 !border-dark-gray-3 !bg-transparent !pl-0',
        props?.className
      )}
    />
  )
}

const getThumbnail = (index) => {
  const num = index % 10
  return `images/thumbnail/thumbnail-${num}.png`
}

const DashboardStatus = () => {
  const [deploy, setDeploy] = useState([])
  const [project, , { projectName }, handleRefreshDefaultProject] = useLocalStorageDefaultProject()

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(
      JSON.stringify([{ field: 'update_date', value: 'desc', option: 'nulls last' }])
    ),
    search: parseAsString,
    limit: parseAsInteger.withDefault(4),
    offset: parseAsInteger.withDefault(0),
  })

  const { filter, sort, search } = query || {}

  const handleRefresh = () => {
    deployApiStub.getDeploy(null, null, project, null, null, dayjs().unix(), true).then((list) => {
      const listInProgress = list.filter((d) => d.status === 'In Progress')
      const listComplete = list.filter((d) => d.status === 'Complete')
      const listPending = list.filter((d) => d.status === 'Pending')
      setDeploy(
        [
          ...listInProgress.slice(0, 1),
          ...listComplete.slice(0, 2),
          ...listPending.slice(0, 1),
        ].map((row, index) => ({
          ...row,
          create_date: dayjs().subtract(index * 2, 'second'),
        }))
      )
    })
    handleRefreshDefaultProject()
  }

  useEffect(() => {
    handleRefresh()
  }, [project])

  useEffect(() => {
    handleRefresh()
    const timerId = setInterval(() => handleRefresh(), 300_000)
    return () => clearInterval(timerId)
  }, [filter, sort, search])

  const columns = [
    {
      title: '日付',
      className: 'text-base text-left',
      dataIndex: 'create_date',
      render: (item) => (
        <RowDate item={item} className="text-base" unit={FORMAT_STRING.datetime_full_str} />
      ),
    },
    {
      title: 'プロジェクト',
      className: 'text-base text-left',
      dataIndex: 'project_id',
      render: () => projectName || 'テストプロジェクト',
    },
    {
      title: 'モジュール配置',
      className: 'text-base text-left min-w-[220px]',
      dataIndex: 'module_config_name',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    },
    {
      title: 'デプロイタイプ',
      className: 'text-base text-left min-w-[100px]',
      dataIndex: 'type',
      render: (item) => <RowContent item={DEPLOYMENT_TYPE_TEXT[item] || ''} />,
    },
    {
      title: 'ステータス',
      className: 'text-base text-left min-w-[100px]',
      dataIndex: 'status',
      render: (item) => (
        <DeployStatus status={item} className="gap-0 font-light" contentClassName="!ml-5" />
      ),
    },
    {
      title: <div className="text-center text-base">ムービー</div>,
      className: ' text-base text-left',
      align: 'center',
      render: (item, record, index) => {
        if (item.execute_result_url && item.status === 'Complete') {
          return (
            <Link
              href={Routes.DEPLOY_MOVIE_SHOW_DETAIL.replace('[deploy_id]', item.id)}
              className="flex flex-row justify-start"
            >
              <img
                src={getThumbnail(index)}
                alt="thumbnail"
                className="h-[20px] w-[30px] rounded object-cover"
              />
              <div className="flex-center absolute h-[20px]  w-[30px]">
                <PlayIcon size={16} color="#fff" />
              </div>
            </Link>
          )
        }
        return <div />
      },
    },
  ]
  return (
    <div
      className="flex w-full flex-col"
      style={{ '-ms-word-break': 'break-keep', lineBreak: 'auto', overflowWrap: 'anywhere' }}
    >
      <div className="flex flex-row justify-between">
        <HeaderTitle title="ダッシュボード" />
        <div className="flex flex-row items-center gap-2">
          <Button
            icon={<ReloadIcon size={32} />}
            type="outline"
            label="リロード"
            className="text-lg font-semibold"
            onClick={() => handleRefresh()}
          />
        </div>
      </div>

      <div
        className="relative px-16 pb-20 pt-4"
        style={{ border: '1px solid var(--dark-gray-3)', borderRadius: 20 }}
      >
        <Table
          className="!border-collapse !rounded-none !border-none"
          rowClassName="text-left !text-primary"
          data={deploy}
          total={10}
          columns={columns}
          pagination={false}
          bordered={false}
          components={{
            header: {
              cell: HeaderCell,
              row: HeaderRow,
            },
            body: {
              cell: BodyCell,
              row: BodyRow,
            },
          }}
        />
        <div className="absolute bottom-4 right-16 w-full max-w-max">
          <Link href={Routes.DEPLOY} className=" inline text-nowrap text-base text-indigo-rainbow">
            もっと見る…
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardStatus

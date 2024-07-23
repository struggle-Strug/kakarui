import dayjs from 'dayjs'

import { memo, useCallback } from 'react'

import { FORMAT_STRING } from '@/constants'

import { HeaderTitle } from '@/components/layout/dashboard'
import { Link, TimeLine } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const data = [
  {
    created: '2024/12/12',
    title: 'システムメンテナンス',
    description: '2024年12月20日(金)の14:00〜16:00まで定期システムメンテナンスを行います。',
    type: 'system',
  },
  {
    created: '2024/12/12',
    title: 'インフォメーション',
    description: 'ロボコンプロジェクトが作成できるようになりました。',
    type: 'project',
    project: {
      id: 1,
    },
    projectId: 1,
  },
  {
    created: '2024/12/12',
    title: 'アップデート',
    description: '○○機能を追加しました。',
    type: 'system',
  },
]

const NoticeItemLink = (item) => {
  if (item?.type === 'project') {
    return (
      <Link href={`/project/${item?.project?.id}`} className="font-semibold text-indigo-rainbow">
        ロボコンプロジェクトについて見る &gt;
      </Link>
    )
  }
  return null
}

const NoticeItem = memo((item) => {
  if (!item?.title) return null

  return (
    <div
      className="grid grid-flow-row"
      style={{ '-ms-word-break': 'break-keep', lineBreak: 'auto', overflowWrap: 'anywhere' }}
    >
      <div className="flex flex-row text-nowrap text-base">
        <div className="w-full max-w-[calc(18%)] whitespace-pre-wrap break-keep pl-[17px] pr-7 text-primary">
          {item?.created ? dayjs(item?.created).format(FORMAT_STRING.date_str) : <>&nbsp;</>}
        </div>
        <div className="w-full max-w-[calc(18%)] whitespace-pre-wrap break-keep pr-[31px] text-primary">
          {item?.title}
        </div>
        <div className="grow ">
          <div className="flex flex-col gap-4 text-base">
            <div className="whitespace-pre-wrap break-keep text-primary">{item?.description}</div>
            <NoticeItemLink {...item} />
          </div>
        </div>
      </div>
    </div>
  )
})

const renderDot = (
  <div className="h-5 w-5 rounded-full border-[6px] border-solid border-[#BFBFBF]">&nbsp;</div>
)

const DashboardNotification = () => {
  const renderItems = useCallback(
    () =>
      [...data].map((item) => ({
        children: <NoticeItem {...item} />,
        dot: item?.title && renderDot,
        className: cn('p-0 m-0', item?.title ? 'pb-[36px]' : 'last:-mb-[36px]'),
      })),
    [data]
  )

  return (
    <div
      className="flex w-full flex-col"
      style={{ '-ms-word-break': 'break-keep', lineBreak: 'auto', overflowWrap: 'anywhere' }}
    >
      <HeaderTitle title="お知らせ" />
      <div
        className="relative flex w-full flex-row items-stretch px-16 py-8"
        style={{ border: '1px solid var(--dark-gray-3)', borderRadius: 20 }}
      >
        <TimeLine
          id="info-dashboard"
          wrapperClassName="grow"
          total={data.length}
          items={renderItems()}
        />
        <div className="absolute bottom-4 right-16 w-full max-w-max">
          <a className=" inline text-nowrap text-base text-indigo-rainbow">もっと見る…</a>
        </div>
        {/* <p
          className=" whitespace-pre-wrap break-keep pb-16"
          style={{
            '-ms-word-break': 'break-keep',
            wordBreak: 'keep-keep',
            lineBreak: 'auto',
            overflowWrap: 'anywhere',
          }}
        >
          hogeテキストhogeテキストhogeテキストhogeテキストhogeテキストhogeテキスト
          <br />
          hogeテキストhogeテキストhogeテキストhogeテキストhogeテキストhogeテキスト
          <br />
          hogeテキストhogeテキストhogeテキストhogeテキストhogeテキストhogeテキスト
          <br />
          hogeテキストhogeテキストhogeテキストhogeテキストhogeテキストhogeテキスト
          <br />
          hogeテキストhogeテキストhogeテキストhogeテキストhogeテキストhogeテキスト
          <br />
        </p> */}
      </div>
    </div>
  )
}

export default DashboardNotification

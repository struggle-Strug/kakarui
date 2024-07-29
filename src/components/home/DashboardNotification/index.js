import dayjs from 'dayjs'

import { memo, useCallback } from 'react'

import { FORMAT_STRING } from '@/constants'

import { HeaderTitle } from '@/components/layout/dashboard'
import { TimeLine } from '@/components/ui'

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

// const NoticeItemLink = (item) => {
//   if (item?.type === 'project') {
//     return (
//       <Link href={`/project/${item?.project?.id}`} className="font-semibold text-indigo-rainbow">
//         ロボコンプロジェクトについて見る &gt;
//       </Link>
//     )
//   }
//   return null
// }

const NoticeItem = memo((item) => {
  if (!item?.title) return null

  return (
    <div
      className="grid grid-flow-row"
      style={{ msWordBreak: 'break-keep', lineBreak: 'auto', overflowWrap: 'anywhere' }}
    >
      <div className="flex flex-row gap-2 text-nowrap text-base">
        <div className="w-full max-w-[135px] whitespace-pre-wrap break-keep text-primary">
          {item?.created ? dayjs(item?.created).format(FORMAT_STRING.date_str) : <>&nbsp;</>}
        </div>
        <div className="w-full max-w-[170px] whitespace-pre-wrap break-keep text-primary">
          {item?.title}
        </div>
        <div className="grow ">
          <div className="flex flex-col gap-4 text-base">
            <div className="whitespace-pre-wrap break-keep text-primary">{item?.description}</div>
          </div>
        </div>
      </div>
    </div>
  )
})

const renderDot = (
  <div className="h-5 w-5 rounded-full border-[6px] border-solid border-[#BFBFBF]">&nbsp;</div>
)

// const NotificationShowMore = () => (
//   <div className="absolute bottom-4 right-16 w-full max-w-max cursor-not-allowed">
//     <Link
//       className="inline text-nowrap text-base text-indigo-rainbow transition-opacity hover:opacity-75"
//       disabled
//     >
//       もっと見る…
//     </Link>
//   </div>
// )

const DashboardNotification = () => {
  const renderItems = useCallback(
    () =>
      [...data].map((item) => ({
        children: <NoticeItem {...item} />,
        dot: item?.title && renderDot,
        className: cn('p-0 m-0', item?.title ? '!pb-[46px] last:!pb-[0px] last:!-mb-[30px]' : ''),
      })),
    [data]
  )

  return (
    <div
      className="flex w-full flex-col"
      style={{ msWordBreak: 'break-keep', lineBreak: 'auto', overflowWrap: 'anywhere' }}
    >
      <HeaderTitle title="お知らせ" />
      <div
        className="relative flex w-full flex-row items-stretch px-9 py-8"
        style={{ border: '1px solid var(--dark-gray-3)', borderRadius: 20 }}
      >
        <TimeLine
          id="info-dashboard"
          wrapperClassName="grow"
          total={data.length}
          items={renderItems()}
        />
        {/* <NotificationShowMore /> */}
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

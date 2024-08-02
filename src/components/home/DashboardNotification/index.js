import Link from 'next/link'
import { memo, useCallback } from 'react'

import { FORMAT_STRING } from '@/constants'

import { HeaderTitle } from '@/components/layout/dashboard'
import { TimeLine } from '@/components/ui'

import { formatDate } from '@/utils/helper/dayjs'
import { cn } from '@/utils/helper/functions'

const data = [
  {
    created: '2024/08/05',
    title: 'インフォメーション',
    link: 'https://forms.office.com/r/8kpdahCkjC',
    linkText: 'お問い合わせはこちら',
    target: '_blank',
    description: '　お気軽にお問い合わせください。',
    type: 'system',
  },
]

const NoticeItem = memo((item) => {
  if (!item?.title) return null

  return (
    <div
      className="grid grid-flow-row"
      style={{ msWordBreak: 'break-keep', lineBreak: 'auto', overflowWrap: 'anywhere' }}
    >
      <div className="flex flex-row gap-2 text-nowrap text-base">
        <div className="w-full max-w-[135px] whitespace-pre-wrap break-keep text-primary">
          {item?.created ? formatDate(item?.created, FORMAT_STRING.date_str) : <>&nbsp;</>}
        </div>
        <div className="w-full max-w-[170px] whitespace-pre-wrap break-keep text-primary">
          {item?.title}
        </div>
        <div className="grow ">
          <div className="flex flex-col gap-4 text-base">
            <div className="float-left whitespace-pre-wrap break-keep text-left text-primary">
              {item?.link && (
                <Link
                  href={item?.link}
                  target={item?.target}
                  alt={item?.linkText}
                  download={item?.download}
                  className="text-xl font-semibold text-indigo-rainbow"
                >
                  {item?.linkText}
                </Link>
              )}
              {item?.description || <>&nbsp;</>}
            </div>
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
        className: cn('p-0 m-0', item?.title ? '!pb-[46px] last:!pb-[0px] last:!-mb-[45px]' : ''),
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

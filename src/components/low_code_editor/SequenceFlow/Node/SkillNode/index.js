import { Divider } from 'antd'
import dayjs from 'dayjs'

import Image from 'next/image'

import { Assets } from '@/constants'

export const SkillNode = ({ data }) => {
  const handleSelectClick = (event) => {
    event.stopPropagation() // 親要素のクリックイベントが発火しないように
  }

  const formattedDate = dayjs(data.updatedAt).format('YYYY/MM/DD HH:mm') // 日付フォーマット

  return (
    <div className="p-2">
      <div className="flex flex-col gap-2 p-2">
        <div className="max-w-[200px] overflow-hidden truncate text-ellipsis text-[14px] font-bold">
          Name : {data.skillName}
        </div>
        <div className="max-w-[200px] overflow-hidden truncate text-ellipsis text-[14px] font-bold">
          Type : {data.skillType}
        </div>
      </div>
      <Divider className="my-2 p-0" />

      <div className="flex items-center justify-start gap-2">
        <select
          onClick={handleSelectClick}
          className="rounded border-2 border-solid border-[#E3E3E4] p-1 text-[14px]"
        >
          {data.siteData &&
            data.siteData.map((site, index) => (
              <option key={index} value={site}>
                {site}
              </option>
            ))}
        </select>
        <div className="scrollbar-hide max-h-[3.6em] w-[150px] overflow-hidden text-ellipsis whitespace-pre-wrap break-words text-[14px] font-bold">
          {data.customProperties}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Image
            src={Assets.LOWCODEEDITOR.userIcon}
            className="w-[20px] shrink-0"
            alt="gen3p"
            width={20}
            height={20}
          />
          <div className="max-w-[100px] truncate text-[10px]">{data.userName}</div>
        </div>
        <div className="flex items-center gap-1">
          <Image
            src={Assets.LOWCODEEDITOR.timeIcon}
            className="w-[20px] shrink-0"
            alt="gen3p"
            width={20}
            height={20}
          />
          <div className="max-w-[150px] truncate text-[10px]">{formattedDate}</div>
        </div>
      </div>
    </div>
  )
}

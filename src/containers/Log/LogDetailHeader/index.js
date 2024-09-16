import dayjs from 'dayjs'
import isNaN from 'lodash/isNaN'

import { useMemo } from 'react'

import { FORMAT_STRING } from '@/constants'
import { useCopyToClipboard } from '@/hooks/share'

import { CopyIcon, DownloadIcon } from '@/components/icons'
import { Button } from '@/components/ui'

import { formatDate } from '@/utils/helper/dayjs'

const HeaderTimer = ({ detail }) => {
  const { execute_start_date: startDate, execute_end_date: endDate } = detail || {}

  return (
    <div className="flex flex-col gap-2 text-base font-light">
      <div className="flex flex-row">
        <span>実施日時:</span>
        &nbsp;
        <span className="min-w-[220px]">
          {startDate && formatDate(startDate, FORMAT_STRING.datetime_full_str)}
        </span>
      </div>
      <div className="flex flex-row">
        <span>完了日時:</span>
        &nbsp;
        <span className="min-w-[220px]">
          {endDate && formatDate(endDate, FORMAT_STRING.datetime_full_str)}
        </span>
      </div>
    </div>
  )
}

const HeaderDownLoadButton = ({ downloadUrl, fileNameLogZip }) => {
  return (
    <a
      target="_blank"
      alt={fileNameLogZip}
      download={fileNameLogZip}
      disabled={!downloadUrl}
      href={downloadUrl}
    >
      <Button
        type="outline"
        label="ダウンロード"
        className="pointer-events-none text-4xl"
        icon={<DownloadIcon size={36} className="text-4xl" />}
        onClick={(event) => event.stopPropagation()}
        disabled={!downloadUrl}
      />
    </a>
  )
}

const HeaderCopyButton = ({ logContent }) => {
  const [, onCopy] = useCopyToClipboard()

  return (
    <Button
      label="コピー"
      icon={<CopyIcon className="text-4xl" />}
      onClick={() => onCopy(logContent)}
      disabled={!logContent}
      type="outline"
    />
  )
}

const LogDetailHeader = ({ detail, logData, logContent }) => {
  const fileNameLogZip = useMemo(() => {
    const logDirs = logData?.url?.split('/') || []
    return logDirs?.[logDirs?.length && !isNaN(logDirs?.length) ? logDirs.length - 1 : 0]
  }, [logData?.url])

  return (
    <div className="mb-5 mt-7 flex w-full flex-row justify-between gap-2">
      <div className="flex flex-row items-center gap-2">
        <HeaderTimer detail={detail} />
        <HeaderDownLoadButton downloadUrl={logData?.url || ''} fileNameLogZip={fileNameLogZip} />
      </div>
      <div className="flex flex-row items-end gap-2">
        <HeaderCopyButton logContent={logContent} />
      </div>
    </div>
  )
}

export default LogDetailHeader

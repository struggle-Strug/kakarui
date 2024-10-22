import { Spin, message } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import JSZip from 'jszip'

import { useEffect, useRef, useState } from 'react'

import { EXPIRED_URL, FORMAT_STRING } from '@/constants'
import { useDeployByProjectQuery, useLogQuery } from '@/hooks/query'

import { CopyIcon, ReloadIcon } from '@/components/icons'
import { Button, Container, Select } from '@/components/ui'

import { formatDate } from '@/utils/helper/dayjs'

const LogShowDetailContainer = ({ projectId, deployId }) => {
  const lastElementRef = useRef()
  const [detail, setDetail] = useState()
  const [isDownloading, setIsDownloading] = useState(true)
  const [logFileContent, setLogFileContent] = useState()
  const [isLoadingLogFile, setLoadingLogFile] = useState(true)
  const [logFiles, setLogFiles] = useState([])
  const [selectedLogFile, setSelectedLogFile] = useState(null)

  const { data, isLoading, isFetching, getDeployDetail, refetch } = useDeployByProjectQuery({
    projectId,
  })

  // TODO: remove when using api
  const id = deployId

  const { data: logData } = useLogQuery({
    projectId,
    deployId: id,
    body: {
      file_name: detail?.deploy_log_file_name,
      end_date: dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT).format(FORMAT_STRING.datetime_full),
    },
  })

  const zipURL = logData?.url

  useEffect(() => {
    setDetail(getDeployDetail(id))
  }, [deployId, projectId, data])

  useEffect(() => {
    if (zipURL) {
      axios
        .create()
        .get(zipURL, {
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.bytes)
            if (percentCompleted === 100) {
              setIsDownloading(false)
            }
          },
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/zip',
          },
        })
        .then(async (res) => {
          const zipData = await JSZip.loadAsync(res.data, {
            base64: true,
            optimizedBinaryString: true,
          })
          const zipFolder = zipData.folder('logs')
          const logFilesOptions = Object.values(zipFolder.files)
            .filter((f) => /^logs\//.test(f.name) && !f.dir)
            .map((item) => {
              const uncompressedSize = item?._data?.uncompressedSize
              const compressedSize = item?._data?.compressedSize
              return {
                uncompressedSize,
                compressedSize,
                label: `${item?.name.replace(/^logs\//, '')} (${Math.round((uncompressedSize || 0) / 1024 / 1024)} MB)`,
                value: item?.name,
              }
            })
          setLogFiles(logFilesOptions)
          if (selectedLogFile) {
            const zipFile = zipData.file(selectedLogFile)
            const currentText = await zipFile.async('text')
            setLogFileContent(currentText)
          } else {
            setSelectedLogFile(logFilesOptions[0].value)
          }
        })
        .finally(() => {
          setLoadingLogFile(false)
        })
    }
  }, [zipURL, detail, isFetching, selectedLogFile])

  useEffect(() => {
    lastElementRef?.current?.scrollIntoView({ behavior: 'instant', block: 'end' })
  }, [logFileContent, isFetching, isLoading, isLoadingLogFile])
  return (
    <Container title="ログ表示(ログ)">
      <Spin className="w-full" spinning={isLoading || isDownloading || isLoadingLogFile}>
        <div className="flex w-full flex-col">
          <div className="text-[28px] font-light text-dark-gray-3">
            <span>ファイル:</span>
            &nbsp;
            <Select
              name="fileName"
              label=""
              options={logFiles}
              placeholder=""
              className="text-[28px] font-light text-dark-gray-3"
              onChange={(value) => {
                setSelectedLogFile(value)
              }}
              value={selectedLogFile}
            />
          </div>
          <div className="mt-2 text-xl font-light">
            <span>コンテナエラーコード:</span>
            &nbsp;
            <span>
              {
                detail?.module_status?.[
                  logFiles?.find((f) => f.value === selectedLogFile)?.label?.replace('_log.txt', '')
                ]?.exitCode
              }
            </span>
          </div>
          <div className="mb-5 mt-7 flex w-full flex-row justify-between gap-2">
            <div className="flex flex-col text-xl font-light">
              <div className="flex flex-row">
                <span>開始日時:</span>
                &nbsp;
                <span>
                  {detail?.execute_start_date &&
                    formatDate(dayjs(detail?.execute_start_date), FORMAT_STRING.datetime_full)}
                </span>
              </div>
              <div className="flex flex-row">
                <span>終了日時:</span>
                &nbsp;
                <span>
                  {detail?.execute_end_date &&
                    formatDate(dayjs(detail?.execute_end_date), FORMAT_STRING.datetime_full)}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-end gap-2">
              <Button
                icon={<ReloadIcon size={36} />}
                type="outline"
                label="リロード"
                onClick={() => {
                  setLoadingLogFile(true)
                  refetch()
                }}
              />
              <Button
                icon={<CopyIcon className="text-4xl" />}
                type="outline"
                label="コピー"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(logFileContent)
                    message.success('コピーしました。')
                  } catch (err) {
                    message.error('コピーに失敗しました。')
                  }
                }}
              />
            </div>
          </div>
          <div className="flex h-[70vh] w-full flex-col overflow-scroll overscroll-auto scroll-smooth rounded-lg border border-solid border-[#d5d3d2] bg-light-gray p-5">
            <p className="whitespace-pre-line break-words">{logFileContent}</p>
            <div ref={lastElementRef} className="h-0 w-full">
              &nbsp;
            </div>
          </div>
        </div>
      </Spin>
    </Container>
  )
}

export default LogShowDetailContainer

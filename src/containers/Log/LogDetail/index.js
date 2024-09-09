import { Spin, Tree } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import JSZip from 'jszip'
import isNaN from 'lodash/isNaN'
import { parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useMemo, useRef, useState } from 'react'

import { EXPIRED_URL, FORMAT_STRING } from '@/constants'
import { useDeployByProjectQuery, useLogQuery } from '@/hooks/query'

import { Container } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

import LogDetailHeader from '../LogDetailHeader'

const LogShowDetailContainer = ({ projectId, deployId }) => {
  const lastElementRef = useRef()
  const wrapperContentRef = useRef()

  const [detail, setDetail] = useState()
  const [logFiles, setLogFiles] = useState([])
  const [isReading, setReading] = useState(true)
  const [logContent, setLogContent] = useState('')

  const [selectedItem, setSelectedItem] = useQueryStates({
    log: parseAsString.withDefault(''),
  })

  const [endDateUrl, setEndDateUrl] = useState(
    dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT).format(FORMAT_STRING.datetime_full)
  )

  const {
    data,
    isLoading: isLoadingDeploys,
    getDeployDetail,
    refetch,
  } = useDeployByProjectQuery({
    projectId,
  })

  if (detail?.id) {
    // eslint-disable-next-line no-console
    console.log('deploy detail', detail)
  }

  const { data: logData, isLoading: isLoadingLog } = useLogQuery({
    projectId,
    deployId,
    body: {
      file_name: detail?.deploy_log_file_name,
      end_date: endDateUrl,
    },
  })

  const fileNameLogZip = useMemo(() => {
    const logDirs = logData?.url?.split('/') || []
    return logDirs?.[logDirs?.length && !isNaN(logDirs?.length) ? logDirs.length - 1 : 0]
  }, [logData?.url])

  const moduleStatus = useMemo(
    () => ({
      ...(logFiles?.reduce((acc, item) => {
        return {
          ...acc,
          [item?.label]: {
            ...detail?.module_status?.[item?.label],
            exitCode: detail?.module_status?.[item?.label]?.exitCode,
            status: detail?.module_status?.[item?.label]?.status,
          },
        }
      }, {}) || {}),
    }),
    [logFiles, detail?.module_status, isLoadingLog, isLoadingDeploys]
  )

  const moduleStatusOptions = Object.keys(moduleStatus).map((key, index) => ({
    label: (
      <span
        className={cn(
          'inline whitespace-nowrap text-nowrap',
          moduleStatus?.[key]?.exitCode ? 'text-red-500' : ''
        )}
      >
        {`${key} ${moduleStatus?.[key]?.exitCode ? `(エラーコード: ${moduleStatus?.[key]?.exitCode?.replace(/"/gi, '')})` : ''}`}
      </span>
    ),
    exitCode: moduleStatus?.[key]?.exitCode,
    value: logFiles?.find((item) => item?.label === key)?.value || `${index}`,
  }))

  useEffect(() => {
    const newDetail = getDeployDetail(deployId)

    setDetail((prev) => ({
      ...prev,
      ...newDetail,
    }))
  }, [deployId, projectId, data, isLoadingDeploys])

  const downloadZip = async () => {
    try {
      setReading(true)
      if (logData?.url && !isLoadingLog) {
        wrapperContentRef.current.innerHTML = ''
        const response = await axios.create().get(logData?.url, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/zip',
          },
        })
        const zipData = await JSZip.loadAsync(response?.data, {
          optimizedBinaryString: true,
        })

        const zipFolder = zipData.folder('logs')
        const logFilesOptions = Object.values(zipFolder.files)
          .filter((f) => /^logs\//.test(f?.name) && f?.name?.includes('_log.txt') && !f.dir)
          .map((item) => {
            const label = item?.name.replace(/^logs\//, '').replace(/_log.txt$/, '')
            return {
              label,
              name: label,
              value: item?.name,
            }
          })
        setLogFiles(logFilesOptions)
        if (selectedItem?.log) {
          const zipFile = zipData.file(selectedItem?.log)
          const textLog = await zipFile.async('text')
          const logLines = textLog.split('\n') || []
          if (!logLines?.length) {
            wrapperContentRef.current.innerHTML = `<div class="flex grow items-center justify-center text-base">データがありません</div>`
          } else {
            for (let i = 0; i < logLines?.length; i += 1) {
              const line = logLines[i]
              const lineElement = document.createElement('span')
              lineElement.textContent = line
              lineElement.appendChild(document.createElement('br'))
              wrapperContentRef.current.appendChild(lineElement)
            }
          }

          setLogContent(textLog)
          setReading(false)
        }
      }
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.log(_error)
    } finally {
      setReading(false)
    }
  }

  useEffect(() => {
    downloadZip()
  }, [logData])

  useEffect(() => {
    lastElementRef?.current?.scrollIntoView({ behavior: 'instant', block: 'end' })
  }, [logContent, selectedItem?.log])

  const logDirectory = () => {
    if (isLoadingDeploys) {
      return (
        <div className="flex grow items-center justify-center text-base">
          <Spin spinning={isLoadingDeploys} />
        </div>
      )
    }
    if (!isLoadingDeploys && !moduleStatusOptions?.length) {
      return (
        <div className="flex grow items-center justify-center text-base">データがありません</div>
      )
    }

    return (
      <Tree.DirectoryTree
        id="directory_log"
        className="directory_log h-full overflow-scroll overscroll-auto"
        defaultExpandAll
        selectedKeys={selectedItem?.log ? [`root-${selectedItem?.log}`] : []}
        onSelect={(selectKeys) => {
          refetch()
          setEndDateUrl(
            dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT).format(FORMAT_STRING.datetime_full)
          )
          setSelectedItem({
            log: selectKeys?.flatMap((key) => key?.replace('root-', ''))?.[0],
          })
        }}
        treeData={[
          {
            title: 'logs',
            key: 'root',
            children: moduleStatusOptions?.map((opt) => ({
              title: opt?.label,
              key: `root-${opt?.value}`,
              isLeaf: true,
            })),
          },
        ]}
      />
    )
  }

  // eslint-disable-next-line no-unused-vars
  const content = useMemo(() => {
    if (!isLoadingLog && !logContent && !isReading) {
      return (
        <div className="flex grow items-center justify-center text-base">データがありません</div>
      )
    }
    if (!isLoadingLog && logContent) {
      return <div className="whitespace-pre-line break-words">{logContent}</div>
    }
    return <div />
  }, [logContent, isLoadingLog, isReading])

  return (
    <Container title="ログ表示(ログ)">
      <Spin className="w-full" spinning={isLoadingDeploys}>
        <div className="flex flex-col">
          <LogDetailHeader {...{ detail, logData, fileNameLogZip, logContent }} />
          <div className="grid w-full grid-cols-3 gap-8">
            <div className="col-span-1">
              <div className="flex h-full w-full rounded-lg border border-solid border-[#d5d3d2] font-light text-dark-gray-3">
                {logDirectory()}
              </div>
            </div>
            <div className="col-span-2">
              <Spin className="w-full" spinning={isLoadingLog || isReading}>
                <div className="flex h-full max-h-[60vh] min-h-[60vh] w-full grow flex-col overflow-x-scroll overflow-y-scroll overscroll-auto scroll-smooth rounded-lg border border-solid border-[#d5d3d2] !bg-light-gray p-6 !text-primary ">
                  <div ref={wrapperContentRef} />
                  <div ref={lastElementRef} className="h-1 w-full">
                    &nbsp;
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </Spin>
    </Container>
  )
}

export default LogShowDetailContainer

import { Spin, Tree } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import JSZip from 'jszip'
import isNaN from 'lodash/isNaN'
import { parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
  EMPTY_LOG,
  EXPIRED_URL,
  FORMAT_STRING,
  MAX_LENGTH_LOG_TAIL,
  MAX_LENGTH_LOG_TAIL_TEXT,
} from '@/constants'
import { useDeployByProjectQuery, useLogQuery } from '@/hooks/query'

import { Container } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

import LogDetailHeader from '../LogDetailHeader'

const LogShowDetailContainer = ({ projectId, deployId, fileName }) => {
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
    dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT).utc().format()
  )

  const {
    data,
    isLoading: isLoadingDeploys,
    getDeployDetail,
    refetch,
  } = useDeployByProjectQuery({
    projectId,
  })

  const dataRequest = {
    file_name: fileName || detail?.deploy_log_file_name,
    end_date: endDateUrl,
  }

  const { data: logData, isLoading } = useLogQuery({ projectId, deployId, body: dataRequest })

  const fileNameLogZip = useMemo(() => {
    const logDirs = logData?.url?.split('/') || []
    return logDirs?.[logDirs?.length && !isNaN(logDirs?.length) ? logDirs.length - 1 : 0]
  }, [logData?.url])

  const moduleStatus = useMemo(
    () => ({
      ...(logFiles?.reduce((acc, item) => {
        const [_, moduleValue] =
          Object.entries(detail?.module_status || {})?.find(
            ([moduleKey]) => moduleKey !== item.label.toLowerCase()
          ) || []

        return {
          ...acc,
          [item?.label?.toLowerCase()]: {
            ...(moduleValue?.[item?.label?.toLowerCase()] || {}),
            exitCode: moduleValue?.exitCode,
            status: moduleValue?.status,
          },
        }
      }, {}) || {}),
    }),
    [logFiles, detail?.module_status, logFiles, isLoadingDeploys]
  )

  const moduleStatusOptions = Object.keys(moduleStatus).map((moduleKey, index) => {
    const moduleStatusItem = moduleStatus?.[moduleKey]
    return {
      label: (
        <span
          className={cn(
            'inline whitespace-nowrap text-nowrap',
            moduleStatusItem?.exitCode ? 'text-red-500' : ''
          )}
        >
          {`${moduleKey} ${moduleStatusItem?.exitCode ? `(エラーコード: ${`${moduleStatusItem?.exitCode}`?.replace?.(/"/gi, '') || ''})` : ''}`}
        </span>
      ),
      exitCode: moduleStatus?.[moduleKey]?.exitCode,
      value: logFiles?.find((item) => item?.label === moduleKey)?.value || `${index}`,
    }
  })

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
      if (logData?.url && !isLoading) {
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
          setReading(false)
          const logLines = textLog.split('\n') || []
          const allLength =
            logLines?.length === 1 && logLines?.[0] === '' ? 0 : logLines?.length || 0
          if (!allLength) {
            wrapperContentRef.current.innerHTML = `<div class="flex grow items-center justify-center text-base">${EMPTY_LOG}</div>`
          } else {
            const lastLine = Number(allLength || 1) - 1
            const firstLine =
              lastLine - MAX_LENGTH_LOG_TAIL >= 0 ? lastLine - MAX_LENGTH_LOG_TAIL : 0

            for (let i = lastLine; i > firstLine; i -= 1) {
              const lineContent = logLines?.[i]
              const lineElement = document.createElement('span')
              lineElement.textContent = lineContent
              lineElement.appendChild(document.createElement('br'))
              wrapperContentRef.current.appendChild(lineElement)
            }
            if (firstLine > 0) {
              const lineElement = document.createElement('div')
              lineElement.className = 'flex grow items-center justify-center text-base'
              lineElement.textContent = MAX_LENGTH_LOG_TAIL_TEXT
              wrapperContentRef.current.appendChild(lineElement)
            }
          }

          setLogContent(textLog)
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
  }, [logContent, selectedItem?.log, isReading])

  const logDirectory = () => {
    if (isLoadingDeploys) {
      return (
        <div className="flex grow items-center justify-center text-base">
          <Spin spinning={isLoadingDeploys} />
        </div>
      )
    }
    if (!isLoadingDeploys && !moduleStatusOptions?.length) {
      return <div className="flex grow items-center justify-center text-base">{EMPTY_LOG}</div>
    }

    return (
      <Tree.DirectoryTree
        id="directory_log"
        className="directory_log h-full overflow-scroll overscroll-auto"
        defaultExpandAll
        selectedKeys={selectedItem?.log ? [`root-${selectedItem?.log}`] : []}
        onSelect={(selectKeys) => {
          refetch()
          setEndDateUrl(dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT).utc().format())
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
              <Spin className="w-full" spinning={isLoading || isReading}>
                <div className="flex h-full max-h-[60vh] min-h-[60vh] w-full grow flex-col overflow-x-scroll overflow-y-scroll overscroll-auto scroll-smooth rounded-lg border border-solid border-[#d5d3d2] !bg-light-gray p-6 !text-primary ">
                  <div
                    ref={wrapperContentRef}
                    className="flex h-full w-full flex-col-reverse whitespace-pre-line break-words"
                  />
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

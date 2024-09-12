import axios from 'axios'
import dayjs from 'dayjs'
import JSZip from 'jszip'
import { parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useRef, useState } from 'react'

import { EMPTY_LOG, EXPIRED_URL, MAX_LENGTH_LOG_TAIL, MAX_LENGTH_LOG_TAIL_TEXT } from '@/constants'
import { useDeployByProjectQuery, useLogQuery } from '@/hooks/query'

import { Container } from '@/components/ui'

import { formatUTCDateToISOString } from '@/utils/helper/dayjs'

import LogContent from '../LogContent'
import LogDetailHeader from '../LogDetailHeader'
import LogDirectory from '../LogDirectory'

const extractLogFiles = async (zipData) => {
  const zipFolder = zipData.folder('logs')
  return Object.values(zipFolder.files)
    .filter((f) => /^logs\//.test(f?.name) && f?.name?.includes('_log.txt') && !f.dir)
    .map((item) => {
      const label = item?.name.replace(/^logs\//, '').replace(/_log.txt$/, '')
      return {
        label,
        name: label,
        value: item?.name,
      }
    })
}

const processLogContent = (textLog, wrapperContentRef) => {
  const logLines = textLog.split('\n') || []
  const allLength = logLines.length === 1 && logLines[0] === '' ? 0 : logLines.length || 0

  if (!allLength) {
    wrapperContentRef.current.innerHTML = `<div class="flex grow items-center justify-center text-base">${EMPTY_LOG}</div>`
  } else {
    const lastLine = Number(allLength || 1) - 1
    const firstLine = lastLine - MAX_LENGTH_LOG_TAIL >= 0 ? lastLine - MAX_LENGTH_LOG_TAIL : 0

    for (let i = lastLine; i > firstLine; i -= 1) {
      const lineContent = logLines[i]
      const lineElement = document.createElement('p')
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
}

const useLogDetail = (projectId, deployId, fileName, selectedItem, wrapperContentRef) => {
  const [detail, setDetail] = useState()
  const [logFiles, setLogFiles] = useState([])
  const [isReading, setReading] = useState(true)
  const [logContent, setLogContent] = useState('')
  const [endDateUrl, setEndDateUrl] = useState(dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT))

  const {
    data,
    isLoading: isLoadingDeploys,
    getDeployDetail,
    refetch,
  } = useDeployByProjectQuery({
    projectId,
  })

  const dataRequest = {
    file_name: fileName,
    end_date: formatUTCDateToISOString(endDateUrl),
  }

  const { data: logData, isLoading: isLoadingFileLog } = useLogQuery({
    projectId,
    deployId,
    body: dataRequest,
  })

  useEffect(() => {
    const newDetail = getDeployDetail(deployId)
    setDetail((prev) => ({ ...prev, ...newDetail }))
  }, [deployId, projectId, data, isLoadingDeploys])

  useEffect(() => {
    if (!isLoadingFileLog && !logData?.url) return

    const downloadZip = async () => {
      try {
        setReading(true)
        if (logData?.url && !isLoadingFileLog) {
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

          const logFilesOptions = await extractLogFiles(zipData)
          setLogFiles(logFilesOptions)

          if (selectedItem?.log) {
            const zipFile = zipData.file(selectedItem?.log)
            const textLog = await zipFile.async('text')
            setReading(false)
            processLogContent(textLog, wrapperContentRef)
            setLogContent(textLog)
          }
        }
      } catch (_error) {
        // eslint-disable-next-line no-console
        console.error(_error)
      } finally {
        setReading(false)
      }
    }

    downloadZip()
  }, [logData, selectedItem, wrapperContentRef])

  return {
    detail,
    logFiles,
    isReading,
    logContent,
    isLoadingDeploys,
    refetch,
    logData,
    setEndDateUrl,
  }
}

const LogShowDetailContainer = ({ projectId, deployId, fileName }) => {
  const lastElementRef = useRef()
  const wrapperContentRef = useRef()

  const [selectedItem, setSelectedItem] = useQueryStates({
    log: parseAsString.withDefault(''),
  })

  const {
    detail,
    logFiles,
    isReading,
    logContent,
    isLoadingDeploys,
    refetch,
    logData,
    setEndDateUrl,
  } = useLogDetail(projectId, deployId, fileName, selectedItem, wrapperContentRef)

  useEffect(() => {
    lastElementRef?.current?.scrollIntoView({ behavior: 'instant', block: 'end' })
  }, [logContent, selectedItem?.log, isReading])

  return (
    <Container title="ログ表示(ログ)">
      <div className="flex flex-col">
        <LogDetailHeader {...{ detail, logData, logContent }} />
        <div className="grid w-full grid-cols-3 gap-8">
          <LogDirectory
            {...{
              detail,
              logFiles,
              isLoadingDeploys,
              refetch,
              setEndDateUrl,
              setSelectedItem,
              selectedItem,
            }}
          />
          <LogContent {...{ isReading, wrapperContentRef, lastElementRef }} />
        </div>
      </div>
    </Container>
  )
}

export default LogShowDetailContainer

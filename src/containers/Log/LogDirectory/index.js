import { Spin, Tree } from 'antd'
import dayjs from 'dayjs'

import { useMemo } from 'react'

import { EMPTY_LOG, EXPIRED_URL } from '@/constants'

import { cn } from '@/utils/helper/functions'

const LogDirectory = ({
  detail,
  logFiles,
  isLoadingDeploys,
  refetch,
  setEndDateUrl,
  setSelectedItem,
  selectedItem,
}) => {
  const moduleStatus = useMemo(() => {
    const modules = Object.entries(detail?.module_status || {})
    const logFileNames = logFiles.map((logFile) => logFile.name.toLowerCase())

    return modules.reduce((acc, [moduleKey, moduleValue]) => {
      const visible = logFileNames.includes(moduleKey.toLowerCase())

      acc[moduleKey.toLowerCase()] = {
        exitCode: moduleValue.exitCode,
        status: moduleValue.status,
        visible,
      }

      return acc
    }, {})
  }, [logFiles, detail?.module_status])

  const moduleStatusOptions = Object.keys(moduleStatus)
    ?.filter((moduleKey) => moduleStatus?.[moduleKey]?.visible)
    .map((moduleKey, index) => {
      const moduleStatusItem = moduleStatus?.[moduleKey?.toLowerCase()]
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
        value:
          logFiles?.find((item) => item?.label?.toLowerCase() === moduleKey?.toLowerCase())
            ?.value || `${index}`,
      }
    })

  const renderContent = () => {
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

    const handleSelect = (selectKeys) => {
      refetch()
      setEndDateUrl(dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT))
      setSelectedItem({
        log: selectKeys?.flatMap((key) => key?.replace('root-', ''))?.[0],
      })
    }

    const treeData = [
      {
        title: 'logs',
        key: 'root',
        children: moduleStatusOptions?.map((opt) => ({
          title: opt?.label,
          key: `root-${opt?.value}`,
          isLeaf: true,
        })),
      },
    ]

    return (
      <Tree.DirectoryTree
        id="directory_log"
        className="directory_log h-full overflow-scroll overscroll-auto"
        defaultExpandAll
        selectedKeys={selectedItem?.log ? [`root-${selectedItem?.log}`] : []}
        onSelect={handleSelect}
        treeData={treeData}
      />
    )
  }

  return (
    <div className="col-span-1">
      <div className="flex h-full w-full rounded-lg border border-solid border-[#d5d3d2] font-light text-dark-gray-3">
        {renderContent()}
      </div>
    </div>
  )
}

export default LogDirectory

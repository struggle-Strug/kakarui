import { Pagination, Spin } from 'antd'

import Image from 'next/image'
import { memo, useState } from 'react'

import { Assets, DEFAULT_PAGE_SIZE_MENU, FORMAT_STRING } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import { useRobotActive } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { formatDate } from '@/utils/helper/dayjs'
import { truncateText } from '@/utils/helper/strings'

const RobotListMenuItem = memo(({ item, onClick }) => (
  <div
    onClick={onClick}
    className="flex shrink-0 items-center gap-x-6 px-4 py-[4px] text-dark-gray-3 transition-colors hover:bg-light-gray"
    role="presentation"
  >
    <div className="shrink-0">
      <Image src={Assets.MENU.project} className="shrink-0" alt="gen3p" width={44} height={42} />
    </div>
    <div className="w-[calc(100%-40px-24px)] flex-1">
      <div
        className="w-full truncate text-[13px] font-semibold leading-[15px] text-dark-gray-3"
        title={item?.name}
      >
        {item?.name}
      </div>
      <div className="space-x-1 text-xs font-light text-primary">
        <span>最終更新日</span>
        <span>{formatDate(item?.update_date, FORMAT_STRING.datetime_str)}</span>
      </div>
    </div>
  </div>
))

const RobotListMenu = ({ data, loading, onClose }) => {
  const [page, setPage] = useState(1)

  const [clicking, startClicking] = useLoadingSimulation(false, 500)
  const { robotActiveId, setRobotActive } = useRobotActive()

  const pageSize = (page - 1) * DEFAULT_PAGE_SIZE_MENU
  const slicedData = data.slice(pageSize, pageSize + DEFAULT_PAGE_SIZE_MENU)

  const doSetRobotActive = useDebouncedCallback((item) => {
    if (item?.id === robotActiveId) return

    startClicking(() => {
      setRobotActive(item)
      onClose?.()
    })
  })

  const onChangePage = useDebouncedCallback((newPage) => {
    startClicking(() => {
      setPage(newPage)
    })
  })

  const renderItem = (item) => (
    <RobotListMenuItem key={item?.id} item={item} onClick={() => doSetRobotActive(item)} />
  )

  return (
    <div className="mx-3 w-[360px] px-3 py-4 font-light text-primary">
      <div className="text-sm">ターゲットを切り替える</div>

      <Spin spinning={loading || clicking}>
        <div className="mt-3.5 pl-5 text-xl">
          {slicedData.map(renderItem)}
          <div className="mt-3.5 flex justify-end">
            <Pagination
              defaultCurrent={page}
              pageSize={DEFAULT_PAGE_SIZE_MENU}
              onChange={onChangePage}
              showSizeChanger={false}
              className="header-menu"
              total={data.length}
              showLessItems
            />
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default RobotListMenu

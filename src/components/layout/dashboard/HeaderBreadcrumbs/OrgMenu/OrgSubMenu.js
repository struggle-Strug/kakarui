import { Pagination, Spin } from 'antd'

import { memo, useState } from 'react'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE_MENU, FORMAT_STRING } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import { useOrganizationActive } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { FolderIcon } from '@/components/icons'

import { formatDate } from '@/utils/helper/dayjs'
import { Routes } from '@/constants'

const OrgSubMenuItem = memo(({ item, onClick }) => (

  <div
    onClick={onClick}
    className="flex shrink-0 items-center gap-x-6 overflow-hidden px-4 py-[4px] text-dark-gray-3 transition-colors hover:bg-light-gray"
    role="presentation"
  >
    <div className="shrink-0">
      <FolderIcon className="text-[40px]" size={40} />
    </div>
    <div className="w-[calc(100%-40px-24px)] flex-1">
      <div
        className="w-full truncate text-[13px] font-semibold leading-[15px] text-dark-gray-3"
        title={item?.organization_name}
      >
        {item?.organization_name}
      </div>
    </div>
  </div>
))

const OrgSubMenu = ({ data, loading, onClose }) => {
  const router = useRouter()
  const [page, setPage] = useState(1)

  const [clicking, startClicking] = useLoadingSimulation(false, 500)
  const { orgActiveId, setOrgActive } = useOrganizationActive()

  const pageSize = (page - 1) * DEFAULT_PAGE_SIZE_MENU
  const slicedData = data.slice(pageSize, pageSize + DEFAULT_PAGE_SIZE_MENU);
  const doSetOrgActive = useDebouncedCallback((item) => {
    if (item?.id === orgActiveId) return
    startClicking(() => {
      setOrgActive(item.organization_id)
      onClose?.()
      router.push(Routes.HOME, null, { shallow: true })
    })

  })

  const onChangePage = useDebouncedCallback((newPage) => {
    startClicking(() => {
      setPage(newPage)
    })
  })

  const renderItem = (item) => (
    <OrgSubMenuItem key={item?.id} item={item} onClick={() => doSetOrgActive(item)} />
  )

  return (
    <div className="mx-3 w-[420px] px-3 py-4 font-light text-primary">
      <div className="text-sm">組織が表示される</div>

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

export default OrgSubMenu
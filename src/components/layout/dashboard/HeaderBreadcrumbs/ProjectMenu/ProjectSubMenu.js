import { Pagination, Spin } from 'antd'

import { memo, useState } from 'react'

import { DEFAULT_PAGE_SIZE_MENU, FORMAT_STRING } from '@/constants'
import { useDebouncedCallback } from '@/hooks/share'

import { FolderIcon } from '@/components/icons'

import { formatDate } from '@/utils/helper/dayjs'

const ProjectSubMenuItem = memo(({ item, onClick }) => (
  <div className="flex shrink-0 items-center gap-x-6 px-4 py-[4px] text-dark-gray-3 transition-colors hover:bg-light-gray">
    <FolderIcon className="text-[40px]" size={40} />
    <div role="presentation" onClick={onClick} className="flex-1">
      <div className="text-[13px] font-semibold leading-[15px] text-dark-gray-3">{item?.name}</div>
      <div className="space-x-1 text-xs font-light text-primary">
        <span>最終更新日</span>
        <span>{formatDate(item?.update_date, FORMAT_STRING.datetime_str)}</span>
      </div>
    </div>
  </div>
))

const ProjectSubMenu = ({ data, loading, setProjectActive, onClose }) => {
  const [page, setPage] = useState(1)

  const slicedData = data.slice(page - 1, page - 1 + DEFAULT_PAGE_SIZE_MENU)

  const doSetProjectActive = useDebouncedCallback((item) => {
    setProjectActive(item)
    onClose?.()
  })

  const renderItem = (item) => (
    <ProjectSubMenuItem key={item?.id} item={item} onClick={() => doSetProjectActive(item)} />
  )

  return (
    <div className="mx-3 w-[420px] px-3 py-4 font-light text-primary">
      <div className="text-sm">プロジェクトを切り替える</div>

      <Spin spinning={loading}>
        <div className="mt-3.5 pl-5 text-xl">
          {slicedData.map(renderItem)}
          <Pagination
            defaultCurrent={page}
            pageSize={DEFAULT_PAGE_SIZE_MENU}
            onChange={(newPage) => setPage(newPage)}
            className="project-header mt-3.5 flex justify-end"
            total={data.length * DEFAULT_PAGE_SIZE_MENU > data.length ? 30 : data.length}
          />
        </div>
      </Spin>
    </div>
  )
}

export default ProjectSubMenu

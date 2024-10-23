import { Pagination, Spin } from 'antd'

import { memo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE_MENU, FORMAT_STRING } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import { useOrganizationActive, useProjectActive, useProjectQuery, useOrganizationQuery, useRobotActive, useRobotQuery} from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'
import { Routes } from '@/constants'

const OrgSubMenuItem = memo(({ item, onClick }) => (

  <div
    onClick={onClick}
    className="flex shrink-0 items-center gap-x-6 overflow-hidden px-4 py-[4px] text-dark-gray-3 transition-colors hover:bg-light-gray"
    role="presentation"
  >
    <div className="w-[calc(100%-40px-24px)] flex-1 py-3">
      <div
        className="w-full truncate text-[13px] font-semibold leading-[15px] text-dark-gray-3"
        title={item?.organization_name || item?.name || ''}
      >
        {item?.organization_name || item?.name || ''}
      </div>
    </div>
  </div>
))

const OrgSubMenu = ({ data, loading, onClose }) => {
  const router = useRouter()
  const [page, setPage] = useState(1)

  const [clicking, startClicking] = useLoadingSimulation(false, 500)
  const { orgActiveId, setOrgActive } = useOrganizationActive()
  const { setProjectActive } = useProjectActive()
  const { setRobotActive } = useRobotActive()
  const { setOrganizationId, setOrganizationDetail } = useOrganizationQuery()
  
  const { filteredData:projectList} = useProjectQuery({
    sort: JSON.stringify([{ field: 'create_date', value: 'desc' }]),
  })

  const { filteredData:robotList } = useRobotQuery({
    sort: JSON.stringify([{ field: 'name', value: 'asc' }]),
  })

  useEffect(() => {
    setProjectActive(projectList.length > 0 ? projectList[0] : []);
  }, [projectList])

  useEffect(() => {
    setRobotActive(robotList.length > 0 ? robotList[0] : [])
  }, [robotList])

  // 重複するorganization_idを排除
  const uniqueData = data.filter((item, index, self) => {
    const id = item.organization_id || item.id;
    return index === self.findIndex((t) => (t.organization_id || t.id) === id);
  });

  const pageSize = (page - 1) * DEFAULT_PAGE_SIZE_MENU
  const slicedData = uniqueData.slice(pageSize, pageSize + DEFAULT_PAGE_SIZE_MENU);
  const doSetOrgActive = useDebouncedCallback((item) => {

    if ((item?.id || item?.organization_id) === orgActiveId) return
    startClicking(() => {
      setOrgActive(item?.id || item?.organization_id);
      setOrganizationDetail(item || {})
      setOrganizationId(item?.id || item?.organization_id)
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
      <div className="text-sm">組織を切り替える</div>

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

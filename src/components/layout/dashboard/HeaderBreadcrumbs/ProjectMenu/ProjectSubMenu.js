import { Pagination } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import { FORMAT_STRING } from '@/constants'
import projectApiStub from '@/hooks/stub/project'

import { formatDate } from '@/utils/helper'

const ProjectSubMenu = ({ setDefaultProject = () => {} }) => {
  const [projects, setProjects] = useState([])
  const [page, setPage] = useState(1)
  const limit = 4
  const offset = 0

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(
      JSON.stringify([{ field: 'create_date', value: 'asc' }])
    ),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  const reload = () => {
    projectApiStub
      .getProjects(filter, sort, search, null, limit, offset + limit * (page - 1))
      .then(setProjects)
  }

  useEffect(() => {
    reload()
  }, [filter, sort, search, page])
  return (
    <div className="mx-3 w-[420px] px-3 py-4 font-light text-primary">
      <div className="text-sm">プロジェクトを切り替える</div>
      <div className="mt-3.5 pl-5 text-xl">
        {(projects || []).map((pro) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            key={pro.id}
            className="flex items-center px-4 py-[4px] text-dark-gray-3 transition-colors hover:bg-light-gray"
          >
            <div className="h-10 w-10 border bg-[#E5A13A]" />
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className="pl-6"
              role="presentation"
              onClick={() => {
                setDefaultProject(pro?.id)
              }}
            >
              <div className="text-[13px] font-semibold leading-[15px] text-dark-gray-3">
                {pro.name}
              </div>
              <div className="text-base text-xs font-light text-primary">
                {`最終更新日 `}
                {formatDate(pro.update_date, FORMAT_STRING.datetime_str)}
              </div>
            </div>
          </div>
        ))}
        <Pagination
          total={24}
          pageSize={limit}
          defaultCurrent={page}
          onChange={(newPage) => setPage(newPage)}
          className="project-header mt-3.5 flex justify-end"
        />
      </div>
    </div>
  )
}

export default ProjectSubMenu

import { Pagination } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import { FORMAT_STRING } from '@/constants'
import projectApiStub from '@/hooks/stub/project'

import { formatDate } from '@/utils/helper'

const ProjectSubMenu = ({ onSetDefaultProject = () => {} }) => {
  const [project, setProject] = useState([])
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
      .getProjects(filter, sort, search, limit, offset + limit * (page - 1))
      .then(setProject)
  }

  const handleDefault = (inputProject) => {
    projectApiStub.setDefaultProject(inputProject).then((res) => onSetDefaultProject(res))
  }

  useEffect(() => {
    reload()
  }, [filter, sort, search, page])
  return (
    <div className="mx-[12px] w-[498px] px-3 py-6 text-lg font-light text-primary">
      <div>プロジェクトを切り替える</div>
      <div className="mt-3.5 pl-5 text-xl">
        {(project || []).map((pro) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            key={pro.id}
            className="flex items-center px-5 py-3.5 text-dark-gray-3 transition-colors hover:bg-light-gray"
            onClick={() => {
              handleDefault(pro)
            }}
          >
            <div className="h-10 w-10 border bg-[#E5A13A]" />
            <div className="pl-6">
              <div className="text-base font-semibold text-dark-gray-3">{pro.name}</div>
              <div className="text-base font-light text-primary">
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
          className="mt-3.5 flex justify-end"
        />
      </div>
    </div>
  )
}

export default ProjectSubMenu

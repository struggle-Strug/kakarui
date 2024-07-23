import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import Head from 'next/head'
import { useEffect, useState } from 'react'

import projectApiStub from '@/hooks/stub/project'

import { AddIcon } from '@/components/icons'
import { ProjectAddEditModal, ProjectSearchBox, ProjectTable } from '@/components/project'
import { Button, Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper'

const ProjectContainer = () => {
  const [project, setProject] = useState([])

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  const onAddProjectSuccess = () => {
    projectApiStub.getProjects(undefined, sort).then(setProject)
  }

  const reload = () => {
    projectApiStub.getProjects(filter, sort, search).then(setProject)
  }

  useEffect(() => {
    reload()
  }, [filter, sort, search])

  return (
    <Container title="プロジェクト管理">
      <Head>
        <title>プロジェクト管理</title>
      </Head>
      <div className="flex-between mb-5">
        <ProjectSearchBox options={getSearchOptions(project, ['name'])} />
        <div>
          <ProjectAddEditModal onSuccess={onAddProjectSuccess}>
            <Button
              icon={<AddIcon size={36} />}
              label="新規プロジェクト作成"
              onClick={() => null}
              type="outline"
            />
          </ProjectAddEditModal>
        </div>
      </div>

      <ProjectTable
        data={project}
        pagination={{}}
        loading={false}
        total={project.length}
        reload={reload}
      />
    </Container>
  )
}

export default ProjectContainer

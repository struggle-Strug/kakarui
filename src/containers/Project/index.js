import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useProjectQuery } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { AddIcon } from '@/components/icons'
import { ProjectAddEditModal, ProjectSearchBox, ProjectTable } from '@/components/project'
import { Button, Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ProjectContainer = () => {
  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching, refetch } = useProjectQuery({ search, sort })

  const onRefetch = useDebouncedCallback(refetch)

  const renderActions = (
    <ProjectAddEditModal onSuccess={onRefetch}>
      <Button
        icon={<AddIcon size={36} />}
        label="新規プロジェクト作成"
        onClick={() => null}
        type="outline"
      />
    </ProjectAddEditModal>
  )

  return (
    <Container title="プロジェクト管理">
      <div className="flex-between mb-5">
        <ProjectSearchBox options={getSearchOptions(data, ['name', 'description'])} />
        <div>{renderActions}</div>
      </div>

      <ProjectTable
        data={filteredData}
        loading={isLoading || isFetching}
        total={filteredData.length}
        reload={onRefetch}
      />
    </Container>
  )
}

export default ProjectContainer

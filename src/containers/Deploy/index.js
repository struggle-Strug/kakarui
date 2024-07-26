import noop from 'lodash/noop'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useDeployQuery } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { DeployAddEditModal, DeploySearchBox, DeploymentTable } from '@/components/deployment'
import { AddIcon, ReloadIcon } from '@/components/icons'
import { Button, Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const DeployContainer = () => {
  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching, refetch } = useDeployQuery({ search, sort })

  const onRefetch = useDebouncedCallback(refetch)

  const renderActions = (
    <>
      <Button icon={<ReloadIcon size={36} />} type="outline" label="リロード" onClick={onRefetch} />
      <DeployAddEditModal>
        <Button type="outline" label="新規デプロイ" icon={<AddIcon size={36} />} onClick={noop} />
      </DeployAddEditModal>
    </>
  )

  return (
    <Container title="デプロイ管理">
      <div className="flex-between mb-5">
        <DeploySearchBox options={getSearchOptions(data, ['module_config_name'])} />
        <div className="flex gap-8">{renderActions}</div>
      </div>

      <DeploymentTable
        data={filteredData}
        loading={isLoading || isFetching}
        total={filteredData.length}
      />
    </Container>
  )
}

export default DeployContainer

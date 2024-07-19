import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/share'
import deployApiStub from '@/hooks/stub/deploy'
import projectApiStub from '@/hooks/stub/project'

import { DeployAddEditModal, DeploySearchBox, DeploymentTable } from '@/components/deployment'
import { AddIcon, ReloadIcon } from '@/components/icons'
import { Button, Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper'

const DeployContainer = () => {
  const [deployments, setDeployments] = useState([])
  const [refreshTime, setRefreshTime] = useState(0)
  const [project, setProject] = useLocalStorage('defaultProject')
  const refreshProject = () => {
    projectApiStub.getDefaultProject().then(setProject)
  }

  useEffect(() => {
    refreshProject()
  }, [])

  const [query] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { sort, search } = query || {}
  const handleRefresh = () => {
    deployApiStub.getDeploy(sort, search, refreshTime).then(setDeployments)
  }

  useEffect(() => {
    setRefreshTime((pre) => pre + 1)
  }, [project])

  useEffect(() => {
    handleRefresh()
    const interval = setInterval(() => {
      setRefreshTime((pre) => pre + 1)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    handleRefresh()
  }, [refreshTime])

  return (
    <Container title="デプロイ管理">
      <div className="flex-between mb-5">
        <DeploySearchBox options={getSearchOptions(deployments, ['module_config_name'])} />
        <div className="flex gap-8">
          <Button
            icon={<ReloadIcon size={36} />}
            type="outline"
            label="リロード"
            onClick={() => setRefreshTime((pre) => pre + 1)}
          />
          <DeployAddEditModal onSuccess={() => handleRefresh()}>
            <Button
              type="outline"
              icon={<AddIcon size={36} />}
              onClick={() => null}
              label="新規デプロイ"
            />
          </DeployAddEditModal>
        </div>
      </div>

      <DeploymentTable
        data={deployments}
        pagination={{}}
        loading={false}
        total={deployments?.length}
      />
    </Container>
  )
}

export default DeployContainer

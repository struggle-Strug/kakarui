import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import Head from 'next/head'
import { useEffect, useState } from 'react'

import { useLocalStorageDefaultProject } from '@/hooks/custom/useLocalStorageSync'
import deployApiStub from '@/hooks/stub/deploy'

import { DeployAddEditModal, DeploySearchBox, DeploymentTable } from '@/components/deployment'
import { AddIcon, ReloadIcon } from '@/components/icons'
import { Button, Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper'

const DeployContainer = () => {
  const [deployments, setDeployments] = useState([])
  const [refreshTime, setRefreshTime] = useState(0)
  const [project] = useLocalStorageDefaultProject()

  const [query] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(30),
    offset: parseAsInteger.withDefault(0),
  })

  const { sort, search, limit, offset, page } = query || {}
  const handleRefresh = (isInit = false) => {
    deployApiStub
      .getDeploy(sort, search, project, limit, offset + limit * (page - 1), refreshTime, isInit)
      .then(setDeployments)
  }

  useEffect(() => {
    setRefreshTime((pre) => pre + 1)
  }, [project, sort, search, limit, offset, page])

  useEffect(() => {
    handleRefresh(true)
    const interval = setInterval(() => {
      setRefreshTime((pre) => pre + 1)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    handleRefresh(true)
  }, [refreshTime])

  return (
    <Container title="デプロイ管理">
      <Head>
        <title>デプロイ管理</title>
      </Head>
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

import { Spin } from 'antd'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Routes } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import moduleConfigApiStub from '@/hooks/stub/module_config'

import { ModuleConfigForm } from '@/components/module_config'
import { Container } from '@/components/ui'

const ModuleConfigDetailContainer = () => {
  const router = useRouter()
  const moduleSetId = router.query.module_set_id

  const [moduleConfigDetail, setModuleConfigDetail] = useState({})

  useEffect(() => {
    moduleConfigApiStub.getModuleConfigById(moduleSetId).then(setModuleConfigDetail)
  }, [moduleSetId])

  const [loading, startLoading] = useLoadingSimulation()

  const onModuleConfigUpdate = (values) => {
    // eslint-disable-next-line no-console
    console.log(values)

    startLoading(() => {
      router.replace(Routes.MODULE_CONFIG)
    })
  }

  return (
    <Container title="モジュール配置設定">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">モジュール配置を設定します。</p>
        <ModuleConfigForm isEdit onAddUpdate={onModuleConfigUpdate} data={moduleConfigDetail} />
      </Spin>
    </Container>
  )
}

export default ModuleConfigDetailContainer

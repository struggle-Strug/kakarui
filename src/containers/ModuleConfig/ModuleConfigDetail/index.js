import { Spin } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useModuleConfigDetailQuery, useModuleConfigUpdate } from '@/hooks/query'

import { ModuleConfigForm } from '@/components/module_config'
import { Container } from '@/components/ui'

const ModuleConfigDetailContainer = () => {
  const router = useRouter()
  const moduleConfigId = router.query.module_config_id

  const data = useModuleConfigDetailQuery(moduleSetId)

  const { doUpdateModuleConfig, isPending: loading } = useModuleConfigUpdate({
    onSuccess: () => {
      router.push(Routes.MODULE_CONFIG)
    },
  })

  if (!data) {
    router.push('/404')
    return `<></>`
  }

  return (
    <Container title="モジュール配置設定">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">モジュール配置を設定します。</p>
        <ModuleConfigForm isEdit onSubmit={doUpdateModuleConfig} data={data} />
      </Spin>
    </Container>
  )
}

export default ModuleConfigDetailContainer

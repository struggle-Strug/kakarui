import { Spin } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useModuleConfigCreate } from '@/hooks/query'

import { ModuleConfigForm } from '@/components/module_config'
import { Container } from '@/components/ui'

const ModuleConfigCreateContainer = () => {
  const router = useRouter()

  const { doCreateModuleConfig, isPending: loading } = useModuleConfigCreate({
    onSuccess: () => {
      router.push(Routes.MODULE_CONFIG)
    },
  })

  return (
    <Container title="モジュール配置設定">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">モジュール配置を設定します。</p>
        <ModuleConfigForm action="create" onSubmit={doCreateModuleConfig} data={null} />
      </Spin>
    </Container>
  )
}

export default ModuleConfigCreateContainer

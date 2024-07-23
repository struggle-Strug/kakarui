import { Spin } from 'antd'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useModuleConfigQuery, useModuleConfigUpdate } from '@/hooks/query'

import { ModuleConfigForm } from '@/components/module_config'
import { Container } from '@/components/ui'

const ModuleConfigDetailContainer = () => {
  const router = useRouter()
  const moduleConfigId = router.query.module_config_id

  const { getModuleConfigDetail } = useModuleConfigQuery()
  const detail = getModuleConfigDetail(moduleConfigId)

  const { doUpdateModuleConfig, isPending: loading } = useModuleConfigUpdate({
    onSuccess: () => {
      router.push({
        pathname: Routes.MODULE_CONFIG,
        query: { reload: 1 },
      })
    },
  })

  if (!detail) {
    router.push('/404')
    return `<></>`
  }

  return (
    <Container title="モジュール配置設定">
      <Head>
        <title>モジュール配置設定</title>
      </Head>
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">モジュール配置を設定します。</p>
        <ModuleConfigForm isEdit onSubmit={doUpdateModuleConfig} data={detail || {}} />
      </Spin>
    </Container>
  )
}

export default ModuleConfigDetailContainer

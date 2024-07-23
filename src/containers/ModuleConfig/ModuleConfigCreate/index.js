import { Spin } from 'antd'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useModuleConfigCreate } from '@/hooks/query'

import { ModuleConfigForm } from '@/components/module_config'
import { Container } from '@/components/ui'

const ModuleConfigCreateContainer = () => {
  const router = useRouter()

  const { doCreateModuleConfig, isPending: loading } = useModuleConfigCreate({
    onSuccess: () => {
      router.push({
        pathname: Routes.MODULE_CONFIG,
        query: { reload: 1 },
      })
    },
  })

  return (
    <Container title="モジュール配置設定">
      <Head>
        <title>モジュール配置設定</title>
      </Head>
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">モジュール配置を設定します。</p>
        <ModuleConfigForm onSubmit={doCreateModuleConfig} data={null} />
      </Spin>
    </Container>
  )
}

export default ModuleConfigCreateContainer

import { Spin } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'

import { ModuleSetForm } from '@/components/module_set'
import { Container } from '@/components/ui'

const ModuleSetCreateContainer = () => {
  const router = useRouter()
  const [loading, startLoading] = useLoadingSimulation()

  const onModuleSetCreate = (values) => {
    // eslint-disable-next-line no-console
    console.log(values)

    startLoading(() => {
      router.replace(Routes.MODULE_SET)
    })
  }

  return (
    <Container title="モジュールセット登録">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">プロジェクトにモジュールセットを登録します。</p>
        <ModuleSetForm onAddUpdate={onModuleSetCreate} />
      </Spin>
    </Container>
  )
}

export default ModuleSetCreateContainer

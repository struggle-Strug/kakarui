import { Spin } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useModuleSetCreate } from '@/hooks/query'

import { ModuleSetForm } from '@/components/module_set'
import { Container } from '@/components/ui'

const ModuleSetCreateContainer = () => {
  const router = useRouter()

  const { doCreateModuleSet, isPending: loading } = useModuleSetCreate({
    onSuccess: () => {
      router.push({
        pathname: Routes.MODULE_SET,
        query: { reload: 1 },
      })
    },
  })
  return (
    <Container title="モジュールセット登録">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">プロジェクトにモジュールセットを登録します。</p>
        <ModuleSetForm onSubmit={doCreateModuleSet} data={null} />
      </Spin>
    </Container>
  )
}

export default ModuleSetCreateContainer

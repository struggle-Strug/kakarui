import { Spin } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useModuleSetDetailQuery, useModuleSetUpdate } from '@/hooks/query'

import { ModuleSetForm } from '@/components/module_set'
import { Container } from '@/components/ui'

const ModuleSetDetailContainer = () => {
  const router = useRouter()
  const moduleSetId = router.query.module_set_id

  const data = useModuleSetDetailQuery(moduleSetId)

  const { doUpdateModuleSet, isPending: loading } = useModuleSetUpdate({
    onSuccess: () => {
      router.push(Routes.MODULE_SET)
    },
  })

  if (!data) {
    router.push('/404')
    return `<></>`
  }

  return (
    <Container title="モジュールセット登録">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">プロジェクトにモジュールセットを登録します。</p>
        <ModuleSetForm isEdit onSubmit={doUpdateModuleSet} data={data} />
      </Spin>
    </Container>
  )
}

export default ModuleSetDetailContainer

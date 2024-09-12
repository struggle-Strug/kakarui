import { Spin } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useModuleSetDelete, useModuleSetQuery } from '@/hooks/query'

import { ModuleSetForm } from '@/components/module_set'
import { Container } from '@/components/ui'

const ModuleSetDeleteContainer = () => {
  const router = useRouter()
  const moduleSetId = router.query.module_set_id

  const { getModuleSetDetail } = useModuleSetQuery()
  const detail = getModuleSetDetail(moduleSetId)

  const { doDeleteModuleSet, isPending: loading } = useModuleSetDelete({
    onSuccess: () => {
      router.push(Routes.MODULE_SET)
    },
  })

  if (!detail) {
    router.push('/404')
    return `<></>`
  }

  return (
    <Container title="モジュールセット削除確認">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">
          以下のモジュールセットを削除します。
          <br />
          削除したモジュールセットを利用していいるモジュール配置には影響はありません。
        </p>
        <ModuleSetForm action="delete" onSubmit={doDeleteModuleSet} data={detail} />
      </Spin>
    </Container>
  )
}

export default ModuleSetDeleteContainer

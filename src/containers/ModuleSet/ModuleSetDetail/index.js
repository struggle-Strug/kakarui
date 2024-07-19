import { Spin } from 'antd'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Routes } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import moduleSetApiStub from '@/hooks/stub/module_set'

import { ModuleSetForm } from '@/components/module_set'
import { Container } from '@/components/ui'

const ModuleSetDetailContainer = () => {
  const router = useRouter()
  const moduleSetId = router.query.module_set_id

  const [moduleSetDetail, setModuleSetDetail] = useState({})

  useEffect(() => {
    moduleSetApiStub.getModuleSetById(moduleSetId).then(setModuleSetDetail)
  }, [moduleSetId])

  const [loading, startLoading] = useLoadingSimulation()

  const onModuleSetUpdate = (values) => {
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
        <ModuleSetForm isEdit onAddUpdate={onModuleSetUpdate} data={moduleSetDetail} />
      </Spin>
    </Container>
  )
}

export default ModuleSetDetailContainer

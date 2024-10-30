import { Spin } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useModuleConfigDelete, useModuleConfigQuery } from '@/hooks/query'

import { SkillConfigForm } from '@/components/skill_config'
import { Container } from '@/components/ui'

const SkillConfigDeleteContainer = () => {
  const router = useRouter()
  const moduleConfigId = router.query.module_config_id

  const { getModuleConfigDetail } = useModuleConfigQuery()
  const detail = getModuleConfigDetail(moduleConfigId)

  const { doDeleteModuleConfig, isPending: loading } = useModuleConfigDelete({
    onSuccess: () => {
      router.push(Routes.MODULE_CONFIG)
    },
  })

  if (!detail) {
    router.push('/404')
    return `<></>`
  }

  return (
    <Container title="モジュール配置削除確認">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">以下のモジュール配置を削除します。</p>
        <SkillConfigForm action="delete" onSubmit={doDeleteModuleConfig} data={detail || {}} />
      </Spin>
    </Container>
  )
}

export default SkillConfigDeleteContainer

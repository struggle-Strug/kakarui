import { Spin } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import moduleConfigApiStub from '@/hooks/stub/module_config'

import { ModuleConfigForm } from '@/components/module_config'
import { Container } from '@/components/ui'

import { uuidv4 } from '@/utils/helper/functions'

const ModuleConfigCreateContainer = () => {
  const router = useRouter()
  const [loading] = useLoadingSimulation()

  const onModuleConfigCreate = async (values) => {
    const newModuleConfig = {
      config_data: {},
      create_date: new Date().toISOString(),
      create_user: 'user',
      id: uuidv4(),
      project_id: '97d29699-d089-ba90-9bcd-b94bc3d29585',
      update_date: new Date().toISOString(),
      update_user: 'user',
      ...values,
    }
    try {
      await moduleConfigApiStub.createModuleConfig(newModuleConfig)
      router.replace(Routes.MODULE_CONFIG)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error)
    }
  }

  return (
    <Container title="モジュール配置設定">
      <Spin spinning={loading}>
        <p className="-mt-6 mb-10 text-lg">モジュール配置を設定します。</p>
        <ModuleConfigForm onAddUpdate={onModuleConfigCreate} />
      </Spin>
    </Container>
  )
}

export default ModuleConfigCreateContainer

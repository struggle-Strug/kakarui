import { useRouter } from 'next/router'

import { Routes } from '@/constants'

import { AddIcon } from '@/components/icons'
import { Button } from '@/components/ui'

const ModuleConfigAddButton = () => {
  const router = useRouter()

  return (
    <Button
      type="outline"
      icon={<AddIcon size={36} />}
      label="新規モジュール配置作成"
      onClick={() => router.push(Routes.MODULE_CONFIG_CREATE)}
    />
  )
}

export default ModuleConfigAddButton

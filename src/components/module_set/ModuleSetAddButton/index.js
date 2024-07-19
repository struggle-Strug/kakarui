import { useRouter } from 'next/router'

import { Routes } from '@/constants'

import { AddIcon } from '@/components/icons'
import { Button } from '@/components/ui'

const ModuleSetAddButton = () => {
  const router = useRouter()

  return (
    <Button
      type="outline"
      icon={<AddIcon size={36} />}
      label="新規モジュールセット"
      onClick={() => router.push(Routes.MODULE_SET_CREATE)}
    />
  )
}

export default ModuleSetAddButton

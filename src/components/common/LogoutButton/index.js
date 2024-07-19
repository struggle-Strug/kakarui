import { Space } from 'antd'

import { useState } from 'react'

import { useLogout } from '@/hooks/query/auth'
import { useDebouncedCallback, useFlag } from '@/hooks/share'

import ConfirmPopup from '../ConfirmPopup'

const LogoutButton = () => {
  const [open, onOpen, onClose] = useFlag()
  const [loading, setLoading] = useState(false)

  const { doLogout } = useLogout()

  const onLogout = useDebouncedCallback(() => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      doLogout()
    }, 750)
  })

  return (
    <ConfirmPopup
      open={open}
      loading={loading}
      placement="bottomLeft"
      title="サインアウトしてもよろしいですか"
      onConfirm={onLogout}
      onCancel={onClose}
    >
      <Space className="w-full" onClick={onOpen}>
        <span>ログアウト</span>
      </Space>
    </ConfirmPopup>
  )
}

export default LogoutButton

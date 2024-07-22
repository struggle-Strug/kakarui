/* eslint-disable no-console */
import { message } from 'antd'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

import { Routes } from '@/constants'

export const useAuth = () => {
  const props = useSession()
  const { data, status } = props
  console.log(props)
  return {
    token: data?.user?.token || data?.token,
    // authenticated: status === 'authenticated' && data?.user?.role === 'admin',
    authenticated: true,
    loading: status === 'loading',
    // permissions: new Set(data?.user?.permissions || []),
    permissions: new Set(Object.values({})),
    username: data?.user?.name || '',
    email: data?.user?.email,
    id: data?.user?.id,
  }
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false)

  const doLogin = async () => {
    setLoading(true)

    await signIn('azure-ad', {
      callbackUrl: `${window.location.origin}`,
      redirect: false,
    })
      .then((response) => {
        const { error, ok } = response || {}
        if (ok) {
          if (error) {
            message.error('メールアドレスが存在しません。')
          } else {
            window.location = '/project'
          }
        } else {
          message.error('メールアドレスが存在しません。')
        }
        setLoading(false)
      })
      .finally(() => setLoading(false))
  }

  return { doLogin, loading }
}

export const useLogout = () => {
  const doLogout = () => {
    signOut({ redirect: false })
      .then(() => {
        window.location.href = Routes.AUTH.LOGIN
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        message.error('何か問題が発生しました。')
      })
  }

  return { doLogout }
}

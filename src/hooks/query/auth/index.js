/* eslint-disable no-console */
import { useQuery } from '@tanstack/react-query'
import { message } from 'antd'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { API, Routes } from '@/constants'

import { Axios } from '@/libs/axios'

export const useAuth = () => {
  const { data, status } = useSession()

  return {
    token: data?.user?.token || data?.token,
    authenticated: status === 'authenticated',
    permissions: new Set(Object.values({})),
    organizationId: null,
    loading: status === 'loading',
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

export const fetchGetMe = async ({ meId, token }) => {
  const response = await Axios.get(API.USER.DETAIL.replace('{user_id}', meId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  console.log({ response })
  return response.data
}

export const useGetMe = () => {
  const { id: meId, token, authenticated } = useAuth()

  const { doLogout } = useLogout()
  const { error, ...restMe } = useQuery({
    queryKey: ['me', meId, token],
    queryFn: async () => {
      try {
        const result = await fetchGetMe({ meId, token })
        return result
      } catch (err) {
        console.log({ status: err?.response?.status })
        throw err
      }
    },
    enabled: Boolean(authenticated && meId),
    keepPreviousData: false,
    cacheTime: 0,
  })
  useEffect(() => {
    if (error?.response?.status === 401) {
      doLogout()
    }
  }, [error, restMe])

  return { ...restMe, error }
}

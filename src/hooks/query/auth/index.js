/* eslint-disable no-console */
import { useQuery } from '@tanstack/react-query'
import { message } from 'antd'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'

import { API, LOCAL_STORAGE_KEYS, Routes, USER_ROLE } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useSyncLocalStorage } from '@/hooks/share'

import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { mockData } from '@/services/mock-data'

import { useOrganizationQuery } from '../organization'

export const fetchMe = async ({ meId } = {}) => {
  try {
    const response = await Axios.get(buildApiURL(API.USER.DETAIL, { user_id: meId }))
    return response
  } catch (err) {
    console.log({ status: err?.response?.status })
    throw err
  }
}

export const useUserActive = () => {
  const [userActive, setUserActive] = useSyncLocalStorage(LOCAL_STORAGE_KEYS.USER, {})

  return {
    userActiveId: userActive?.id,
    userActive,
    setUserActive,
  }
}

export const useAuth = () => {
  const { data, status } = useSession()

  const authenticated = status === 'authenticated'
  const token = data?.user?.token || data?.token
  const entraId = data?.user?.entra_id || ''
  const id = data?.user?.id || ''

  return {
    token,
    authenticated,
    permissions: new Set(Object.values({})),
    username: data?.user?.name || '',
    loading: status === 'loading',
    email: data?.user?.email,
    entraId,
    id,
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
// -- WARNING: Do not edit this code --
export const useGetMe = () => {
  const { organizationDetail } = useOrganizationQuery()
  const { id: meId, authenticated } = useAuth()
  const { setUserActive } = useUserActive()
  const { stubEnabled } = useStubEnabled()

  const query = useQuery({
    queryKey: ['me', meId, stubEnabled],
    queryFn: async () => {
      if (stubEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockData.me.user
      }

      const response = await fetchMe({ meId })
      return response.data?.user
    },
    enabled: Boolean(authenticated && meId),
    select: (response) => {
      setUserActive(response)
      return response
    },
  })

  const enable = query.data?.enable

  const meRole = query.data?.role?.trim()
  const meMainRole = organizationDetail?.main_role?.trim()
  const meSubRole = organizationDetail?.sub_role?.trim()

  const isSystemAdmin = enable && [meMainRole, meRole].includes(USER_ROLE.SYSTEM_ADMIN)
  const isDeployAdmin = enable && meSubRole === USER_ROLE.DEPLOY_ADMIN
  const isOrgAdmin = enable && meMainRole === USER_ROLE.ORG_ADMIN
  const isMember = enable && meMainRole === USER_ROLE.MEMBER

  const isAcceptedDeployment = useMemo(() => {
    if (isOrgAdmin && !isDeployAdmin) return false
    if (isMember && !isDeployAdmin) return false

    return true
  }, [isOrgAdmin, isMember, isDeployAdmin])

  const isAcceptedAddEditProject = useMemo(() => {
    if (isSystemAdmin || isOrgAdmin) return true

    return false
  }, [isSystemAdmin, isOrgAdmin])

  return {
    ...query,
    //
    isSystemAdmin,
    isDeployAdmin,
    isOrgAdmin,
    isMember,
    //
    isAcceptedDeployment,
    isAcceptedAddEditProject,
  }
}

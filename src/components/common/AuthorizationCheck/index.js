/* eslint-disable no-unused-vars */
import { Result, Space, Spin } from 'antd'

import { useRouter } from 'next/router'
import { Suspense } from 'react'

import { USER_ROLE } from '@/constants'
import { useAuth, useGetMe } from '@/hooks/query'

import { Button } from '@/components/ui'

/**
 * Check if is current logged admin is authorized
 * @param {ADMIN_ROLE} [role] - The required role for authorized access.
 * @param {import('react').ReactNode} children - The component or content to render if authorized.
 * @param {Function} [onUnauthorized] - Optional callback function to handle authorization failures.
 *
 * @example
 * <AuthorizationCheck role={ADMIN_ROLE.EVENT_PROVIDER} /> // use for screen requiring eventProvider role
 * <AuthorizationCheck role={ADMIN_ROLE.OPERATOR} /> // use for screen requiring operator role
 */

const AuthorizationCheck = ({ children }) => {
  const router = useRouter()

  const { loading } = useAuth()

  const MEMBER_ROUTES = [
    /^\/user-manage$/,
    /^\/user-invite$/,
    /^\/user$/,
    /^\/user-change$/,
    /^\/deploy-manage$/,
  ]
  const { data: me, isError, isLoading, isFetched, isSuccess } = useGetMe()

  const isDeployAdmin = me?.user?.organizations?.some(
    (organization) => organization?.sub_role === USER_ROLE.DEPLOY_ADMIN
  )
  const isMember =
    me?.user?.organizations?.some((organization) =>
      [USER_ROLE.MEMBER, USER_ROLE.ORG_ADMIN].includes(organization?.main_role)
    ) || me?.user?.role === USER_ROLE.SYSTEM_ADMIN

  const isPrivateRoute = MEMBER_ROUTES.some((regexp) => regexp.test(router.pathname))

  const isAuthorized = isMember || isDeployAdmin
  if (isLoading || isError || loading) {
    return <Spin className="w-full" />
  }

  if (!isAuthorized && isPrivateRoute && !isMember && isFetched && isSuccess) {
    return (
      <section className="flex-center size-full">
        <Result
          status="403"
          title={<h1 className="bold text-main text-lg">403</h1>}
          subTitle="申し訳ありませんが、このページにアクセスする権限がありません。"
          extra={
            <Space className="flex-center">
              <Button onClick={router.back}>前のページに戻る</Button>
            </Space>
          }
        />
      </section>
    )
  }

  return <Suspense fallback={<Spin />}>{children}</Suspense>
}

export default AuthorizationCheck

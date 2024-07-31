import { Spin } from 'antd'

import { useRouter } from 'next/router'
import { Suspense, useEffect, useMemo } from 'react'

import { MEMBER_ROLE_BLOCKED_PAGES, Routes } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useAuth, useGetMe, useOrganizationQuery } from '@/hooks/query'

import Result from '../Result'

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

  const { data: me, isError, isLoading, isFetched, isSuccess, ...query } = useGetMe()
  const { isSystemAdmin, isOrgAdmin, isMember, isDeployAdmin } = query || {}

  const { setOrganizations } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()

  useEffect(() => {
    const _organizations = me?.organizations || []

    if (!isLoading && isSuccess) {
      setOrganizations(_organizations)
    }
  }, [router.pathname, me?.organizations, isError, isLoading, isSuccess])

  useEffect(() => {
    if (query?.refetch) {
      query?.refetch?.()
    }
  }, [router.pathname])

  // --- permission check --
  const isPermission = useMemo(() => {
    if (isMember && MEMBER_ROLE_BLOCKED_PAGES.includes(router.pathname)) return false

    return true
  }, [router.pathname, isSystemAdmin, isOrgAdmin, isDeployAdmin, isMember])

  const isAuthorized = isSystemAdmin || isOrgAdmin || isMember || isDeployAdmin

  const isNotFoundPage = router.pathname === Routes.NOT_FOUND

  if ((isLoading || loading || isError) && !stubEnabled) {
    return <Spin className="w-full" />
  }

  if (!isNotFoundPage && (!isAuthorized || (isFetched && isSuccess && !isPermission))) {
    return (
      <Result
        title="403"
        subTitle="申し訳ありませんが、このページにアクセスする権限がありません。"
      />
    )
  }

  return <Suspense fallback={<Spin />}>{children}</Suspense>
}

export default AuthorizationCheck

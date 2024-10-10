import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { APP_NAME, Routes } from '@/constants'

import { Progressbar } from '@/components/layout/common'

import AppProviders from '@/contexts'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

import '@/styles/index.css'

export default function MyApp({ Component, pageProps }) {
  const { session, ...restPageProps } = pageProps

  const router = useRouter()

  const isAuthPage = router.pathname === Routes.AUTH.LOGIN

  const isPublicPage = router.pathname === Routes.CHECK

  const idLowCodeEditorPage = router.pathname === Routes.LOW_CODE_EDITOR

  const layout = useCallback(
    (children) => {
      if (isPublicPage || idLowCodeEditorPage) {
        return children
      }

      if (isAuthPage) {
        return <AuthLayout>{children}</AuthLayout>
      }

      return <DashboardLayout>{children}</DashboardLayout>
    },
    [isAuthPage, isPublicPage, router.pathname]
  )

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <AppProviders locale={router.locale || 'ja'} pageProps={restPageProps}>
        <Progressbar />
        {layout(<Component {...restPageProps} />)}
      </AppProviders>
    </>
  )
}

import { memo } from 'react'
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer'

import { loadYupValidate } from '@/configs/yup'

import { loadDayjsLocale } from '@/libs/dayjs'

import AntdProvider from './Antd'
import AuthProvider from './NextAuth'
import ReactIconsProvider from './ReactIcons'
import { ReactQueryProvider } from './ReactQuery'

function AppProviders({ children, locale, pageProps }) {
  loadDayjsLocale(locale)
  loadYupValidate(locale)

  return (
    <main className={` font-sans`}>
      <AuthProvider>
        <ReactQueryProvider pageProps={pageProps}>
          <AntdProvider>
            <ReactIconsProvider>
              <WrapBalancerProvider>{children}</WrapBalancerProvider>
            </ReactIconsProvider>
          </AntdProvider>
        </ReactQueryProvider>
      </AuthProvider>
    </main>
  )
}

export default memo(AppProviders)

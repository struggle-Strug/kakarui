import { Layout, Spin } from 'antd'

import { useRouter } from 'next/router'

import { APP_HEIGHT_HEADER, APP_WIDTH_SIDER } from '@/configs/theme'
import { Routes } from '@/constants'
import { useAuth } from '@/hooks/query'

import { ErrorBoundary, Header, Sider } from '@/components/layout/dashboard'

const DashboardLayout = ({ children }) => {
  const router = useRouter()
  const { authenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex-center h-screen w-screen" style={{ maxWidth: 1440 }}>
        <Spin size="large" tip="読み込み中" className="text-white">
          <div />
        </Spin>
      </div>
    )
  }

  if (!authenticated && !loading) {
    router.replace(Routes.AUTH.LOGIN)
    return null
  }

  return (
    <Layout>
      <Header />
      <Layout>
        <Sider />
        <Layout.Content
          style={{
            maxWidth: 1440,
            marginRight: 'auto',
            position: 'relative',
            padding: '40px 64px',
            marginLeft: APP_WIDTH_SIDER,
            marginTop: APP_HEIGHT_HEADER,
            minHeight: `calc(100vh - ${APP_HEIGHT_HEADER}px)`,
            overflowY: 'auto',
            height: 1380,
          }}
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout

import { Avatar, Layout } from 'antd'

import { APP_HEIGHT_HEADER } from '@/configs/theme'

import { UserIcon } from '@/components/icons'

import Logo from '../../common/Logo'
import HeaderBreadcrumbs from '../HeaderBreadcrumbs'

const Header = () => {
  const renderLogo = (
    <div className="shrink-0">
      <Logo className="w-[140px]" />
    </div>
  )

  const renderBreadcrumbs = (
    <div className="flex-1">
      <HeaderBreadcrumbs />
    </div>
  )

  const renderAuthenticated = (
    <div className="flex items-center">
      <Avatar size={44} icon={<UserIcon />} />
    </div>
  )

  return (
    <Layout.Header
      style={{
        left: 0,
        padding: 0,
        height: APP_HEIGHT_HEADER,
        borderBottom: '1px solid var(--primary)',
        borderTop: '1px solid var(--primary)',
        background: '#e4e4e4',
        overflow: 'hidden',
        position: 'fixed',
        width: '100%',
        zIndex: 999,
        top: 0,
      }}
    >
      <div className="flex-between item-center flex size-full gap-x-0 px-4">
        {renderLogo}
        {renderBreadcrumbs}
        <div className="flex items-center justify-end">{renderAuthenticated}</div>
      </div>
    </Layout.Header>
  )
}

export default Header

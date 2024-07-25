import { Avatar, Layout } from 'antd'

import { APP_HEIGHT_HEADER } from '@/configs/theme'

import { UserIcon } from '@/components/icons'

import Logo from '../../common/Logo'
import HeaderBreadcrumbs from '../HeaderBreadcrumbs'

const Header = () => {
  // const items = [
  //   {
  //     label: 'ログアウト',
  //     onClick: () => doLogout(),
  //     icon: <LogOutIcon />,
  //     key: '0',
  //   },
  // ]

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

  // const renderStore = (
  //   <Space className="flex-center mr-[72px] flex-shrink-0 cursor-pointer gap-2.5">
  //     <Image src={Assets.COMMON.STORE} width={38} height={34} alt="store" />
  //     <div className="flex-center text-base font-semibold text-dark-gray-3">
  //       {t('common.module_store')}
  //     </div>
  //   </Space>
  // )

  // const renderNotification = (
  //   <Space className="mr-9 cursor-pointer">
  //     <Image src={Assets.COMMON.NOTIFICATION} width={36} height={43} alt="notification" />
  //   </Space>
  // )

  const renderAuthenticated = (
    <div className="flex items-center">
      <Avatar size={44} icon={<UserIcon />} />
      {/* <Dropdown menu={{ items }} trigger={['click']} onOpenChange={() => {}}>
        <Space className="cursor-pointer" style={{ height: APP_HEIGHT_HEADER }}>
          <Avatar size={44} icon={<UserIcon />} />
        </Space>
      </Dropdown> */}
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
        <div className="flex items-center justify-end">
          {/* {renderStore}
          {renderNotification} */}
          {renderAuthenticated}
        </div>
      </div>
    </Layout.Header>
  )
}

export default Header

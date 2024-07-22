import { Layout, Menu } from 'antd'

import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import { APP_WIDTH_SIDER } from '@/configs/theme'

import { getMenuHref, getMenuItems } from '@/utils/helper'

import RoutesTree from '@/RoutesTree'

const Sider = () => {
  const router = useRouter()
  const unReads = {}

  const menus = getMenuItems(RoutesTree(), unReads)

  const [openKeys, setOpenKeys] = useState([router.pathname])

  const onOpenChange = useCallback(
    (items) => {
      const latestOpenKey = items.find((key) => openKeys.indexOf(key) === -1)

      if (router.pathname.indexOf(latestOpenKey) === -1) {
        setOpenKeys(items)
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
      }
    },
    [openKeys, router.pathname]
  )

  useEffect(() => {
    const href = getMenuHref(menus, router.pathname)
    if (href) {
      setOpenKeys(Array.isArray(href) ? href : [href])
    } else {
      setOpenKeys(['/'])
    }
  }, [router.pathname])

  return (
    <Layout.Sider
      // collapsible
      style={{
        zIndex: 998,
        position: 'fixed',
        background: 'var(--primary)',
        transition: 'all 0.2s',
        overflow: 'auto',
        paddingTop: 96,
        border: 'none',
        height: '100%',
      }}
      width={APP_WIDTH_SIDER}
    >
      <Menu
        defaultOpenKeys={openKeys}
        selectedKeys={openKeys}
        openKeys={openKeys}
        multiple={false}
        mode="inline"
        items={menus}
        className="h-full bg-primary"
        onOpenChange={onOpenChange}
      />
    </Layout.Sider>
  )
}

export default Sider

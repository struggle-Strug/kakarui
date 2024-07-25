import { Badge } from 'antd'

import { Routes } from '@/constants'

import { Link } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const getLabel = (item) => {
  const disabled = !!item?.children

  if (item.type === 'link') {
    return item.label
  }
  if (!disabled && item.href) {
    return (
      <Link href={item.href} className={cn('text-sm', item.labelClassName)}>
        {item.label}
      </Link>
    )
  }
  return item.label
}

export const getMenuItems = (menuItems, unReads) => {
  return (menuItems || []).map((item) => {
    const showBadge = unReads?.[item?.badge] > 0

    const icon = (
      <div className="relative flex flex-row items-center justify-start">
        <div>{item?.icon}</div>
        {showBadge && <Badge dot offset={[-6, -20]} color="var(--badge-red)" />}
      </div>
    )

    return {
      ...item,
      icon,
      key: item?.href || item?.label,
      label: getLabel(item),
      ...(item.children && { children: getMenuItems(item.children, unReads) }),
    }
  })
}

export function checkRouteActive(pathname, route) {
  return pathname === route || pathname.startsWith(route)
}

export const getMenuHref = (items, pathname) => {
  const getHrefRecursive = (children) => {
    for (let i = 0; i < children.length; i += 1) {
      const item = children[i] || {}
      if (item.children && item.children.length > 0) {
        const childHref = getHrefRecursive(item.children)
        if (childHref) {
          return [item.href, childHref]
        }
      }
      if (checkRouteActive(pathname, item.href) && item.href !== Routes.HOME) {
        return item.href
      }
    }

    return null
  }

  return getHrefRecursive(items)
}

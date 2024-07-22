import { Switch } from 'antd'

import Image from 'next/image'

import { Assets } from '@/constants'

const MENU_ICON_SEIZE = {
  module_config: { width: 44.25, height: 37.5 },
  deploy: { width: 36, height: 36 },
}

export const getMenuIcon = (key) => {
  const src = Assets.MENU[key]
  const size = MENU_ICON_SEIZE[key]

  return src ? <Image src={src} width={size.width} height={size.height} alt={key} /> : null
}

export const SwitchThemeIcon = () => {
  return <Switch className="left-menu-switch h-[28px] w-[69px]" size="large" />
}

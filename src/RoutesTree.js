import { Routes } from '@/constants'

import { getMenuIcon } from './components/icons/menu'

const RoutesTree = () => {
  return [
    {
      href: Routes.MODULE_CONFIG,
      label: 'モジュール\n配置',
      icon: getMenuIcon('module_config'),
    },
    {
      href: Routes.DEPLOY,
      label: 'デプロイ\n管理',
      icon: getMenuIcon('deploy'),
    },
  ]
}

export default RoutesTree

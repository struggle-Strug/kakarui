import { Dropdown } from 'antd'
import noop from 'lodash/noop'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useGetMe, useOrganizationQuery } from '@/hooks/query'

import { UsersLightIcon } from '@/components/icons'

import { cn } from '@/utils/helper/functions'

const OrgMenu = () => {
  const router = useRouter()

  const { organizationDetail } = useOrganizationQuery()
  const { isMember } = useGetMe()

  const disabledRedirectUser = Boolean(isMember)

  const items = [
    {
      label: (
        <div className="border-bottom-gray mx-3 flex w-[400px] px-3 py-4 font-semibold text-dark-gray-2">
          <UsersLightIcon size={40} />
          <div className="pl-1.5">
            <div>組織サブメニュー</div>
            <div className="text-lg">{organizationDetail?.organization_name || ''}</div>
          </div>
        </div>
      ),
      onClick: noop,
      key: '0',
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[400px] px-3 py-4',
            disabledRedirectUser ? 'text-dark-grey-2' : 'text-black'
          )}
        >
          ユーザ管理
        </div>
      ),
      onClick: () => router.push(Routes.USER),
      disabled: disabledRedirectUser,
      key: '1',
    },
    {
      label: (
        <div className="border-bottom-gray mx-3 flex w-[400px] px-3 py-4 text-black">
          モジュール管理
        </div>
      ),
      onClick: () => router.push(Routes.MODULE),
      key: '2',
    },
    {
      label: <div className="mx-3 flex w-[400px] px-3 py-4 text-black">モジュールセット管理</div>,
      onClick: () => router.push(Routes.MODULE_SET),
      key: '3',
    },
  ]

  return (
    <div className="flex flex-col">
      <Dropdown menu={{ items }} trigger={['click']} overlayClassName="pt-7 header-dropdown">
        <div className="cursor-pointer text-sm">組織</div>
      </Dropdown>
    </div>
  )
}

export default OrgMenu

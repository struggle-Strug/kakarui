import { useEffect } from 'react'
import { Dropdown } from 'antd'
import noop from 'lodash/noop'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'

import { UsersLightIcon } from '@/components/icons'
import { useOrganizationQuery, useOrganizationActive } from '@/hooks/query'
import { cn } from '@/utils/helper/functions'
import OrgSubMenu from './OrgSubMenu'
import { useFlag } from '@/hooks/share'

const OrgMenu = ({ organizationDetail, isMember }) => {
  const router = useRouter()

  const [open, onOpen, onClose] = useFlag()

  const disabledRedirectUser = Boolean(isMember)
  const { organizations, isLoading, setOrganizationDetail, setOrganizationId } = useOrganizationQuery();
  const { setOrgActive } = useOrganizationActive();
  

  useEffect(() => {
    if (organizations.length > 0) {
      setOrgActive(organizations[0].organization_id || organizations[0].id)
      setOrganizationDetail(organizations?.[0] || {})
      setOrganizationId(organizations?.[0]?.organization_id || organizations?.[0]?.id)
    }
  }, [organizations])

  
  const items = [
    {
      label: (
        <div className="border-bottom-gray mx-3 flex w-[400px] cursor-default items-center px-3 py-4 font-semibold text-dark-gray-2">
          <UsersLightIcon size={40} />
          <div className="pl-1.5">
            <div>組織サブメニュー</div>
            <div className="text-lg">{organizationDetail[0]?.organization_name == undefined ? organizationDetail[0]?.name : organizationDetail[0]?.organization_name}</div>
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
      label: <div className="mx-3 border-bottom-gray flex w-[400px] px-3 py-4 text-black">モジュールセット管理</div>,
      onClick: () => router.push(Routes.MODULE_SET),
      key: '3',
    },
    {
      label: <div className="border-bottom-gray mx-3 flex w-[400px] px-3 py-4 text-black">スキル管理</div>,
      onClick: () => router.push(Routes.SKILL_SET),
      key: '4',
    },
    {
      label: <OrgSubMenu data={organizations} loading={isLoading} onClose={onClose} />,
      onClick: ({ domEvent: event }) => {
        event.preventDefault()
      },
      disabled: true,
      className: '!pointer-events-auto !cursor-pointer !rounded-l-[24px] !rounded-r-[24px]',
      key: '5',
    },
  ]

  const onOpenChange = (enable) => (enable ? onOpen() : onClose())

  return (
    <div className="flex flex-col">
      <Dropdown 
        menu={{ items }} 
        trigger={['click']} 
        overlayClassName="pt-7 header-dropdown" 
        onOpenChange={onOpenChange}
        open={open}>
        <div className="cursor-pointer text-sm">組織</div>
      </Dropdown>
    </div>
  )
}

export default OrgMenu

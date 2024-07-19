import { Dropdown } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'

import { UsersLightIcon } from '@/components/icons'

const SipMenu = () => {
  const router = useRouter()
  const items = [
    {
      label: (
        <div className="border-bottom-gray mx-[12px] flex w-[498px] px-3 py-6 text-lg font-semibold text-dark-gray-3">
          <UsersLightIcon size={40} />
          <div className="pl-1.5">
            <div>組織サブメニュー</div>
            <div className="text-lg">SIP</div>
          </div>
        </div>
      ),
      onClick: () => null,
      key: '0',
    },
    {
      label: (
        <div className="border-bottom-gray mx-[12px] flex w-[498px] px-3 py-6 text-lg text-dark-gray-3">
          ユーザ管理
        </div>
      ),
      onClick: () => router.push(Routes.USER),
      key: '1',
    },
    {
      label: (
        <div className="border-bottom-gray mx-[12px] flex w-[498px] px-3 py-6 text-lg text-dark-gray-3">
          モジュール管理
        </div>
      ),
      onClick: () => router.push(Routes.MODULE),
      key: '2',
    },
    {
      label: (
        <div className="mx-[12px] flex w-[498px] px-3 py-6 text-lg text-dark-gray-3">
          モジュールセット管理
        </div>
      ),
      onClick: () => router.push(Routes.MODULE_SET),
      key: '3',
    },
  ]

  return (
    <div className="flex flex-col">
      <Dropdown menu={{ items }} trigger={['click']} overlayClassName="pt-9 header-dropdown">
        <div className="cursor-pointer text-sm">組織</div>
      </Dropdown>
    </div>
  )
}

export default SipMenu

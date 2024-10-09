import { Dropdown } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'

import { cn } from '@/utils/helper/functions'
import { SettingOutlined } from '@ant-design/icons'

const SettingMenu = () => {
  const router = useRouter()


  const items = [
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[150px] px-3 py-4',
          )}
        >
          組織管理
        </div>
      ),
      onClick: () => router.push(Routes.USER),
      key: '0',
    },
    {
      label: (
        <div className="mx-3 flex w-[150px] px-3 py-3">
          サイトデータ管理
        </div>
      ),
      onClick: () => router.push(Routes.MODULE),
      key: '1',
    },
  ]

  return (
    <div className="absolute top-[50rem] left-2">
      <Dropdown menu={{ items }} trigger={['click']} placement='right'>
        <div className="cursor-pointer text-sm w-12 h-12 pt-2"><SettingOutlined className='setting'/></div>
      </Dropdown>
    </div>
  )
}

export default SettingMenu

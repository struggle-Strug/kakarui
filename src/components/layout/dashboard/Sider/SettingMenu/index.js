import { Dropdown } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'

import { SettingOutlined } from '@ant-design/icons'

const SettingMenu = () => {
  const router = useRouter()

  const items = [
    {
      label: (
        <div className="mx-3 flex w-[150px] px-3 py-3">
          サイトデータ管理
        </div>
      ),
      onClick: () => router.push(Routes.SITEDATA),
      key: '0',
    },
  ]

  return (
    <div className="absolute top-[49rem] left-3">
      <Dropdown menu={{ items }} trigger={['click']} placement='right'>
        <div className="cursor-pointer text-sm w-12 h-12">
          <SettingOutlined className='setting'/>
        </div>
      </Dropdown>
    </div>
  )
}

export default SettingMenu

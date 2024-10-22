import { Dropdown } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'

import { cn } from '@/utils/helper/functions'
import { BellOutlined } from '@ant-design/icons'

const Notification = () => {
  const router = useRouter()


  const items = [
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            'border-bottom-gray mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
    {
      label: (
        <div
          className={cn(
            ' mx-3 flex w-[250px] px-1 py-2 pr-[-2rem] ',
          )}
        >
            <p className='text-wrap'>
                AAAAモジュールの登録は失敗しました。2024/10/9 9:00:00
            </p>
        </div>
      ),
    },
  ]

  return (
      <Dropdown menu={{ items }} trigger={['click']} overlayClassName='notifi header-dropdown pt-0.5'>
        <div className="cursor-pointer text-sm w-12 h-12 pt-2"><BellOutlined className='bell'/></div>
      </Dropdown>
  )
}

export default Notification

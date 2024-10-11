import { Button } from 'antd'

import Image from 'next/image'

// 必要に応じてアンタードのボタンをインポート
import { Assets } from '@/constants'

const Header = () => {
  return (
    <div className="text-wh1te flex h-[60px] w-full items-center justify-between !bg-[#413D39] bg-black px-6 py-2">
      <div className="flex items-center gap-4 text-white">
        <div className="flex items-center">
          <Image
            src={Assets.LOWCODEEDITOR.logo}
            className="shrink-0"
            alt="gen3p"
            width={200}
            height={90}
          />
        </div>
        <div className="text-[16px] font-[600px]">Technical Preview版</div>
      </div>
      <div className="flex gap-4 text-white">
        <Button className="!rounded !border-2 !border-white !bg-black !px-6 !text-[14px] !font-bold !text-white">
          Import
        </Button>
        <Button className="!rounded border !bg-white !px-8 !text-[14px] !font-bold !text-black">
          Save
        </Button>
      </div>
    </div>
  )
}

export default Header

import { Dropdown } from 'antd'

import Image from 'next/image'
import { useEffect } from 'react'

import { Assets, DEV } from '@/constants'
import { useRobotActive, useRobotQuery } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import RobotListMenu from './RobotListMenu'

const RobotMenu = () => {
  const [open, onOpen, onClose] = useFlag()

  const { data, isLoading } = useRobotQuery({
    sort: JSON.stringify([{ field: 'create_date', value: 'asc' }]),
  })

  const { robotActive, setRobotActive } = useRobotActive()

  useEffect(() => {
    if (!robotActive?.name && data?.[0]?.name) {
      setRobotActive(data?.[0])
    }
  }, [data])

  const items = [
    {
      label: <RobotListMenu data={data} loading={isLoading} onClose={onClose} />,
      className: '!pointer-events-auto !cursor-pointer !rounded-l-[24px] !rounded-r-[24px]',
      onClick: ({ domEvent: event }) => event?.preventDefault?.(),
      disabled: true,
    },
  ]

  const onOpenChange = (enable) => (enable ? onOpen() : onClose())

  if (!DEV) {
    return (
      <>
        <div className="text-sm">ターゲット</div>
        <div className="flex items-center">
          <Image src={Assets.MENU.project} alt="gen3p" width={24} height={22} />
          <span className="ml-3 text-sm">Nyokkey Gen3B</span>
        </div>
      </>
    )
  }

  return (
    <>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        overlayClassName="pt-7 header-dropdown"
        onOpenChange={onOpenChange}
        open={open}
      >
        <div className="w-max cursor-pointer text-sm hover:opacity-75">ターゲット</div>
      </Dropdown>
      <div className="flex items-center">
        <Image src={Assets.MENU.project} alt="gen3p" width={24} height={22} />
        <span className="ml-3 text-sm">{robotActive?.name}</span>
      </div>
    </>
  )
}

export default RobotMenu

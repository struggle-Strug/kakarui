import Image from 'next/image'

import { Assets, Routes } from '@/constants'

import { Link } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const Logo = ({ className }) => {
  return (
    <Link href={Routes.HOME} className="h-full shrink-0">
      <div className={cn('relative aspect-[513/157] size-full', className)}>
        <Image src={`${Assets.COMMON.LOGO}`} className="object-contain" fill alt="logo" />
      </div>
    </Link>
  )
}

export default Logo

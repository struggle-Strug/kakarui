import Image from 'next/image'

import { Assets, Routes } from '@/constants'

import { Link } from '@/components/ui'

const LogoLogin = () => {
  return (
    <Link href={Routes.AUTH.LOGIN}>
      <div className="relative aspect-square size-full">
        <Image src={`${Assets.COMMON.LOGO_LOGIN}`} fill alt="logo" />
      </div>
    </Link>
  )
}

export default LogoLogin

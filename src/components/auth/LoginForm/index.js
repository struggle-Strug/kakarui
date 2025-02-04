import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

import { Assets } from '@/constants'

import { Logo } from '@/components/layout/common'
import { Button } from '@/components/ui'

const LoginForm = () => {
  const [loading, setLoading] = useState()

  const onSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)

    signOut({ redirect: false })
    await new Promise((resolve) => {
      setTimeout(resolve, 1500)
    })

    const redirectUrl =
      process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ||
      'https://krkr-admin.vercel.app/api/auth/callback/azure-ad'
    const clientId = process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID

    const authUrl = `https://${tenantId}.b2clogin.com/${tenantId}.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_signin&client_id=${clientId}&nonce=ebMjd72e3V&redirect_uri=${redirectUrl}&scope=openid%20https://${tenantId}.onmicrosoft.com/${clientId}/Api.ReadWrite&response_type=token&prompt=login`
    if (typeof window !== 'undefined') window.location = authUrl
    // doLogin({ username: 'admin', password: '123456' })
  }

  return (
    <section className="flex-center relative h-screen w-full">
      <div className="absolute inset-0 z-0">
        <Image
          src={Assets.COMMON.BACKGROUND_LOGIN}
          className="object-cover"
          alt="Background"
          quality={75}
          priority
          fill
        />
      </div>
      <div className="relative z-10 h-[416px] w-[378px] flex-col items-center justify-between rounded-2xl bg-white py-[90px] shadow-light">
        <div>
          <Logo className="h-[63px] w-[275px]" />
        </div>
        <Button
          label="サインイン"
          onClick={onSubmit}
          loading={loading}
          className="h-10 w-[267px] !bg-[#1E314D]"
        />
      </div>
    </section>
  )
}

export default LoginForm

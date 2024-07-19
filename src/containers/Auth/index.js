import { useState } from 'react'

import { Assets } from '@/constants'
import { useLogin } from '@/hooks/query'

import { Logo } from '@/components/layout/common'
import { Button } from '@/components/ui'

const LoginForm = () => {
  const [loading, setLoading] = useState()

  const { doLogin } = useLogin()

  const onSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)

    await new Promise((resolve) => {
      setTimeout(resolve, 1500)
    })

    doLogin({ username: 'admin', password: '123456' })
  }

  return (
    <section className="flex-center relative h-screen w-full">
      <div className="absolute inset-0 z-0">
        <img
          className="h-full w-full object-cover"
          src={Assets.COMMON.BACKGROUND_LOGIN}
          alt="Background"
        />
      </div>
      <div className="relative z-10 h-[555px] w-[505px] flex-col items-center justify-between rounded-2xl bg-white py-[120px] shadow-light">
        <div>
          <Logo className="h-[84px] w-[367px]" />
        </div>
        <Button
          label="サインイン"
          onClick={onSubmit}
          loading={loading}
          className="h-[54px]  w-[357px] !bg-[#1E314D]"
        />
      </div>
    </section>
  )
}

export default LoginForm

/* eslint-disable no-console */
import axios from 'axios'
import queryString from 'query-string'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { DEV, Routes } from '@/constants'

import LoginContainer from '@/containers/Auth'

const LoginPage = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      localStorage.clear()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const extractTokenFromUrl = () => {
    if (!router.asPath || !router.asPath.includes('#access_token')) {
      return null
    }

    const hash = router.asPath.split('#')[1]
    const parsed = queryString.parse(hash)

    const accessToken = parsed?.access_token
    const expiresIn = parsed?.expires_in

    if (accessToken && (DEV || expiresIn)) {
      return {
        accessToken,
        expiresIn,
      }
    }

    return null
  }

  const saveTokenAndRedirect = async (tokenData) => {
    try {
      await axios.post('/api/auth/save-token', tokenData)
      setTimeout(() => {
        window.location.href = Routes.HOME
      }, 200)
    } catch (error) {
      console.error('Error sending access token to server:', error)
    }
  }

  const handleTokenFromUrl = async () => {
    const tokenData = extractTokenFromUrl()
    if (tokenData) {
      await saveTokenAndRedirect(tokenData)
    }
  }

  const handleInitialActions = async () => {
    await handleLogout()
    await handleTokenFromUrl()
  }

  useEffect(() => {
    handleInitialActions()
  }, [router.asPath])

  return (
    <section className="flex-center min-h-screen">
      <LoginContainer />
    </section>
  )
}

export default LoginPage

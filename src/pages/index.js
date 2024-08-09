/* eslint-disable no-console */

/* eslint-disable no-unused-vars */
import axios from 'axios'
import queryString from 'query-string'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

import LoginContainer from '@/containers/Auth'

const LoginPage = () => {
  const router = useRouter()

  useEffect(() => {
    if (router.asPath && router.asPath.includes('#access_token')) {
      const hash = router.asPath.split('#')[1]

      const parsed = queryString.parse(hash)
      if (parsed.access_token) {
        axios
          .post('/api/auth/save-token', {
            accessToken: parsed.access_token,
            expiresIn: parsed.expires_in,
          })
          .then((response) => {
            // Redirect to a secure page or home page after processing
            setTimeout(() => {
              if (typeof window !== 'undefined') window.location = '/home'
            }, 200)
          })
          .catch((error) => {
            console.error('Error sending access token to server:', error)
          })
      }
    }
  }, [router.asPath])

  return (
    <section className="flex-center min-h-screen">
      <LoginContainer />
    </section>
  )
}

export default LoginPage

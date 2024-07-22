/* eslint-disable no-console */

/* eslint-disable no-unused-vars */
import axios from 'axios'
import queryString from 'query-string'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

import LoginForm from '@/containers/Auth'

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
            router.push('/home')
          })
          .catch((error) => {
            console.error('Error sending access token to server:', error)
          })
      }
    }
  }, [router.asPath])

  return (
    <section className="flex-center min-h-screen" style={{ width: 1440 }}>
      <LoginForm />
    </section>
  )
}

export default LoginPage

/* eslint-disable no-unused-vars */

/* eslint-disable consistent-return */
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

import { Routes } from '@/constants'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|icons|images|favicon.ico).*)'],
  unstable_allowDynamic: ['/node_modules/**'],
}

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const response = NextResponse.next()
    // const router = req.nextUrl
    // const isAuth = !!token

    // Set locale cookie
    response.cookies.set('locale', 'ja')

    // Basic Authentication check
    if (!DEV) {
      const basicAuth = req.headers.get('authorization')

      if (!basicAuth) {
        return new NextResponse('Authorization header missing', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Protected Area"',
          },
        })
      }

      const auth = basicAuth.split(' ')[1]
      const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')

      const expectedUser = process.env.BASIC_AUTH_USER
      const expectedPassword = process.env.BASIC_AUTH_PASSWORD

      if (user !== expectedUser || pwd !== expectedPassword) {
        return new NextResponse('Authentication required', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
          },
        })
      }
    }

    // NextAuth Authentication
    // const goBackHome = () => NextResponse.redirect(new URL(Routes.HOME, req.url))
    // const redirectToLogin = () => NextResponse.redirect(new URL(Routes.AUTH.LOGIN, req.url))

    // if (router.pathname === Routes.AUTH.LOGIN) {
    //   return isAuth ? goBackHome() : null
    // }

    // if (!isAuth && req.method !== 'POST') {
    //   return redirectToLogin()
    // }

    return response
  },
  {
    pages: {
      signIn: Routes.AUTH.LOGIN,
    },
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

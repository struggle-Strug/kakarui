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

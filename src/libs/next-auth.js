/* eslint-disable no-unused-vars */

/* eslint-disable no-console */
import base64url from 'base64url'

import { decode, encode } from 'next-auth/jwt'
import { signIn } from 'next-auth/react'

import { Routes } from '@/constants'

const AzureADProvider = {
  id: 'azure-ad',
  name: 'Azure Active Directory',
  type: 'oauth',
  wellKnown: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration?appid=${process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}`,
  authorization: {
    params: {
      scope: 'openid profile email 0049ffb4-a5e8-4f66-b3d7-f1694bd929a7/Api.ReadWrite',
      response_type: 'token',
    },
  },
  scope: 'openid profile email 0049ffb4-a5e8-4f66-b3d7-f1694bd929a7/Api.ReadWrite',
  response_type: 'token',
  clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
  checks: [],
  idToken: false,
  response_mode: 'query',
  async profile(profile, tokens) {
    console.log(`tokens`, profile, tokens)
    return profile
  },
}

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [AzureADProvider],
  callbacks: {
    async signIn({ account, profile, email, credentials }) {
      return true // Returning `true` to allow the sign-in process
    },
    async redirect(props) {
      const { url, baseUrl, error } = props

      // Check for error
      if (error) {
        return `${baseUrl}/error?error=${error}`
      }
      if (typeof window !== 'undefined') {
        // Extract access token from URL fragment (not recommended for production)
        const fragmentParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = fragmentParams.get('access_token')
        const expiresIn = fragmentParams.get('expires_in')

        // **Security Consideration:** Ideally, avoid storing the access token in the client-side
        console.log('Access Token (for demonstration only):', accessToken)

        // **Recommended Approach:** Implement server-side exchange for a more secure token
        // This might involve sending the access token to your server-side API and receiving a new token

        // Continue with authentication based on your application logic (avoid using the access token here)
        sessionStorage.setItem('auth_token', accessToken)

        // Sign user in using NextAuth.js
        await signIn(accessToken) // Adjust based on your NextAuth.js setup

        return url || baseUrl
      }
      return url
    },
    async jwt(props) {
      const { token, user, account, profile } = props

      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      console.log(`sessiolln`, session, token)
      session.user = token.user
      session.token = token

      return session
    },
  },
  jwt: {
    encode: async ({ token, secret, maxAge }) => {
      const jwtToken = await encode({ token, secret }) // jwt.sign(token, secret, { expiresIn: maxAge })
      return base64url.encode(jwtToken)
    },
    decode: async ({ token, secret }) => {
      const decodedToken = base64url.decode(token)
      const decoded = await decode({ token: decodedToken, secret })
      return decoded
    },
  },
  events: {
    async signIn(message) {
      // Custom event for logging or other actions
      console.log('User signed in:', message)
    },
  },
  debug: true, // Enable debug for detailed logs
  pages: { signIn: Routes.AUTH.LOGIN },
}
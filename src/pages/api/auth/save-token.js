/* eslint-disable no-console */
import jwt from 'jsonwebtoken'
import { setCookie } from 'nookies'

import { DEV } from '@/constants'

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { accessToken, expiresIn } = req.body

    try {
      // Decode the JWT to get user information (you might need to adjust this based on your token structure)
      const decodedToken = jwt.decode(accessToken)

      // if (decodedToken.appid !== process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID) {
      //   res.status(500).json({ error: 'Invalid token' })
      // }

      // You might need to validate the access token by calling the OAuth provider's userinfo endpoint or decoding it directly.
      // For demonstration, we assume the accessToken is valid and contains user info.

      // Create a session object
      const expiresAt = Date.now() + expiresIn * 1000

      const sessionToken = {
        user: {
          name: decodedToken.family_name
            ? `${decodedToken.family_name} ${decodedToken.given_name}`.trim()
            : decodedToken.name,
          email: decodedToken.email || decodedToken.preferred_username,
          id: decodedToken.oid, // Azure AD User Object ID
          roles: decodedToken.roles || [], // If roles are available in the ID token
          token: accessToken,
        },
        expiresAt,
      }

      // Encode the session token
      let token = jwt.sign(sessionToken, secret)

      if (DEV) {
        // Set the session cookie
        setCookie({ res }, 'next-auth.session-token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        })
      } else {
        // Set the session cookie
        setCookie({ res }, 'next-auth.session-token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        })
      }

      res.status(200).json({ message: 'Token saved successfully' })
    } catch (error) {
      console.error('Error saving access token:', error)
      res.status(500).json({ error: 'Error saving access token' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

/* eslint-disable no-console */
import jwt from 'jsonwebtoken'
import { setCookie } from 'nookies'

import { encode } from 'next-auth/jwt'

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
      const token = await encode({ token: sessionToken, secret })

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
        setCookie({ res }, '__Secure-next-auth.session-token', token, {
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
/*
sample token
{
  aud: '00000003-0000-0000-c000-000000000000',
  iss: 'https://sts.windows.net/5539607f-960f-4c8c-a098-1d15d191c4e8/',
  iat: 1721002948,
  nbf: 1721002948,
  exp: 1721007024,
  acct: 1,
  acr: '1',
  acrs: [ 'urn:user:registersecurityinfo' ],
  aio: 'AVQAq/8XAAAA1T311XPalwNo9W2928W3JXkCd7frFoiURFJCNZJ05YzAx+yrLeEx93jrZIxtOnaLkqF1oGBNbbk8JBAGDLINQojmUW73aOthof2m2us3KFo=',
  altsecid: '1:live.com:00030000FC707290',
  amr: [ 'pwd' ],
  app_displayname: 'etk-dev-app',
  appid: '0049ffb4-a5e8-4f66-b3d7-f1694bd929a7',
  appidacr: '0',
  email: 'pqtsoft@gmail.com',
  family_name: 'Phạm',
  given_name: 'Thắng',
  haswids: 'true',
  idp: 'live.com',
  idtyp: 'user',
  ipaddr: '115.76.49.180',
  name: 'Pham Thang',
  oid: '795030af-69f7-4b88-86c8-a3407b42c35f',
  platf: '5',
  puid: '10032003A345BBD6',
  rh: '0.Ac8Af2A5VQ-WjEygmB0V0ZHE6AMAAAAAAAAAwAAAAAAAAADPAAI.',
  scp: 'email openid profile User.Invite.All User.Read User.ReadWrite.All',
  signin_state: [ 'kmsi' ],
  sub: 'BGsZ_S8teq8PwwCG6I_KElNDysJ-nufMi0LnJhcZt8g',
  tenant_region_scope: 'NA',
  tid: '5539607f-960f-4c8c-a098-1d15d191c4e8',
  unique_name: 'live.com#pqtsoft@gmail.com',
  uti: 'J_oHoj84d0iFm7vl6ZkAAA',
  ver: '1.0',
  xms_idrel: '8 5',
  xms_st: { sub: 'zCxMoLbxz9ignkO9xoOl7BCixhO912uTrWBlZIiJ5SU' },
  xms_tcdt: 1718323340
} */

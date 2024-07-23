import axios from 'axios'

import { getSession, signOut } from 'next-auth/react'

import { API_ROOT, Routes, TIMEOUT, httpStatusCode } from '@/constants'

const instance = axios.create({
  baseURL: `https://karakuri.agecode.dev/proxy?url=${API_ROOT}`,
  timeout: TIMEOUT,
})

instance.interceptors.request.use(async (request) => {
  const session = await getSession()

  if (session) {
    request.headers.Authorization = `Bearer ${session?.user?.token}`
  }

  return request
})

const redirectIfUnAuthorized = async () => {
  if (typeof window !== 'undefined') {
    await signOut({
      redirect: false,
    }).then(() => {
      window.location.href = Routes.AUTH.LOGIN
    })
  }
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return 'timeout'
    }

    // if (error?.response?.status === httpStatusCode.UNAUTHORIZED) {
    //   redirectIfUnAuthorized()
    // }

    return Promise.reject(error)
  }
)

export { instance as Axios }

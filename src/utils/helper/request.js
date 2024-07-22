import queryString from 'query-string'

import { DEFAULT_PAGE_SIZE } from '@/constants'

import { Axios } from '@/libs/axios'

export function buildURL(url, query) {
  let _url = url
  if (query) {
    _url += /\?/.test(url) ? '&' : '?'
    if (typeof query === 'object') {
      _url += queryString.stringify(query)
    } else {
      _url += query
    }
  }
  return _url
}

export const fetch = async (URL, query) => {
  const response = await Axios.get(buildURL(URL, query))
  return response.data
}

export const fetcher = async ({ url, query } = {}) => {
  const { page, pageSize = DEFAULT_PAGE_SIZE, ...rest } = query || {}
  const URL = buildURL(url, {
    page: page || 0,
    pageSize,
    ...rest,
  })
  const response = await Axios.get(URL)
  return response?.data
}

export const post = async ({ url, params }) => {
  const response = await Axios.post(url, params)
  return response?.data
}

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @tanstack/query/exhaustive-deps */
import { useQuery } from '@tanstack/react-query'
import { message } from 'antd'

import { useEffect } from 'react'

import { fetch, post, usePagination, useStateQueries } from '@/utils/helper'

export const usePaginationQuery = ({
  queryURL,
  queryKey,
  query = {},
  placeholderData,
  responseKey = 'results',
  ...options
} = {}) => {
  const { page, pageSize, search, sort, setPage, setPageSize } = useStateQueries(query)

  const onError = (e) => message.error(e?.response?.data?.message)

  const { data, isFetching, isPreviousData, ...rest } = useQuery({
    queryKey: [queryKey, { page, pageSize, search, sort, ...query }],
    queryFn: () =>
      placeholderData ??
      fetch(queryURL, {
        page: Math.max(page - 1, 0),
        pageSize,
        search,
        sort,
        ...query,
      }),

    refetchOnWindowFocus: false,
    keepPreviousData: true,
    cacheTime: 0,
    retry: true,
    onError,
    ...options,
  })

  const { [responseKey]: results } = data || {}
  const total = results?.length || 0

  const { pagination } = usePagination({ page, pageSize, setPage, setPageSize, total })

  useEffect(() => {
    // Reset page when these dependencies change, excludes sort since it doesn't affect the total result
    setPage(1)
  }, [search, JSON.stringify(query)])

  return { data: results || [], total, isFetching, pagination, ...rest }
}

export const usePostPaginationQuery = ({ queryURL, queryKey, query = {}, ...options } = {}) => {
  const { page, pageSize, search, sort, setPage, setPageSize } = useStateQueries(query)

  const onError = (e) => message.error(e?.response?.data?.message)

  const { data, isFetching, isPreviousData, ...rest } = useQuery({
    queryKey: [queryKey, { page, pageSize, search, sort, ...query }],
    queryFn: async () => {
      return post({
        url: queryURL,
        params: {
          page: Math.max(page - 1, 0),
          pageSize,
          search,
          sort,
          ...query,
        },
      })
    },

    refetchOnWindowFocus: false,
    keepPreviousData: true,
    cacheTime: 0,
    retry: true,
    onError,
    ...options,
  })

  const { total, results } = data || {}

  const { pagination } = usePagination({ page, pageSize, setPage, setPageSize, total })

  useEffect(() => {
    // Reset page when these dependencies change, excludes sort since it doesn't affect the total result
    setPage(1)
  }, [search, JSON.stringify(query)])

  return { data: results || [], total, isFetching, pagination, ...rest }
}

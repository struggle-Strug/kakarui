import { useInfiniteQuery } from '@tanstack/react-query'

import { DEFAULT_PAGE_SIZE } from '@/constants'

import { useQueryInfinite, useStateQueries } from '@/utils/helper/query'
import { fetcher, post } from '@/utils/helper/request'

export const useInfinite = (key, { queryURL, variables = {}, options } = {}) => {
  const { select, getNextPageParam } = useQueryInfinite({ iteratee: options?.iteratee })
  const { search, sort } = useStateQueries(variables)

  const {
    data: { pages: data, total } = {},
    hasNextPage,
    fetchNextPage,
    ...query
  } = useInfiniteQuery(
    key,
    async ({ pageParam = 0 }) => {
      return fetcher({
        url: queryURL,
        query: {
          page: pageParam,
          pageSize: variables.pageSize || DEFAULT_PAGE_SIZE,
          ...variables,
          ...(search && { search }),
          ...(sort && { sort }),
        },
      })
    },
    {
      select,
      getNextPageParam,
      // enabled: !isServer,
      ...options,
    }
  )

  const loadMore = () => {
    if (hasNextPage && data?.length < total) fetchNextPage()
  }

  return {
    hasNextPage: hasNextPage && data?.length < total,
    fetchNextPage,
    loadMore,
    total,
    data,
    ...query,
  }
}

export const usePostInfinite = (key, { queryURL, variables = {}, options } = {}) => {
  const { select, getNextPageParam } = useQueryInfinite({ iteratee: options?.iteratee })

  const {
    data: { pages: data, total } = {},
    hasNextPage,
    fetchNextPage,
    ...query
  } = useInfiniteQuery(
    key,
    async ({ pageParam = 0 }) => {
      return post({
        url: queryURL,
        params: {
          page: pageParam,
          pageSize: variables.pageSize || DEFAULT_PAGE_SIZE,
          ...variables,
        },
      })
    },
    {
      select,
      getNextPageParam,
      // enabled: !isServer,
      ...options,
    }
  )

  const loadMore = () => {
    if (hasNextPage && data?.length < total) fetchNextPage()
  }

  return {
    hasNextPage: hasNextPage && data?.length < total,
    fetchNextPage,
    loadMore,
    total,
    data,
    ...query,
  }
}

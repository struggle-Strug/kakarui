import uniqBy from 'lodash/uniqBy'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import { useCallback } from 'react'

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants'

export const useStateQueries = (defaultQuery) => {
  const [query, setQuery] = useQueryStates(
    {
      pageSize: parseAsString.withDefault(defaultQuery?.pageSize || DEFAULT_PAGE_SIZE),
      sort: parseAsString.withDefault(defaultQuery?.sortInit || null),
      page: parseAsInteger.withDefault(DEFAULT_PAGE),
      search: parseAsString.withDefault(''),
    },
    { history: 'replace' }
  )

  const setPage = useCallback((page) => setQuery({ page }), [setQuery])
  const setPageSize = useCallback((pageSize) => setQuery({ pageSize }), [setQuery])

  return { ...query, setPage, setPageSize }
}

export const useQueryInfinite = ({ iteratee } = {}) => {
  const select = (prev) => {
    const { pages = [] } = prev || {}
    const page = pages.map((item) => item.results || item || []).flat()
    return {
      ...prev,
      total: pages[pages.length - 1]?.total || 0,
      pages: uniqBy([].concat(...page), iteratee || 'id'),
    }
  }

  const getNextPageParam = (nextPage) => {
    const { currentPage: page, totalPages, results = [], total: recordTotal } = nextPage || {}
    return page < totalPages && results.length < recordTotal ? +page + 1 : undefined
  }

  return { select, getNextPageParam }
}

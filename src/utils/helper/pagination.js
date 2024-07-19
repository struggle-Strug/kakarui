/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react'

import { DEFAULT_PAGE_SIZE } from '@/constants'

const scrollOption = { shallow: true, scroll: false }

export const usePagination = ({ total, page, pageSize, setPage, setPageSize } = {}) => {
  const handlePaginationChange = useCallback(
    async (_page, _pageSize) => {
      await setPage(_page, scrollOption)
      await setPageSize(_pageSize, scrollOption)
    },
    [scrollOption, setPage, setPageSize]
  )

  const pagination = {
    showSizeChanger: total > DEFAULT_PAGE_SIZE,
    onChange: handlePaginationChange,
    current: Math.max(page, 1),
    hideOnSinglePage: false,
    pageSize,
    total,
  }

  return { pagination }
}

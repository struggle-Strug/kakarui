import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { SORT_TYPE } from '@/constants'

const { ASC, DESC } = SORT_TYPE

export const useCustomRowSort = ({ field }) => {
  const router = useRouter()
  const { query: { sort: sortQuery, ...query } = {} } = router

  const [sort, setSort] = useState([])

  useEffect(() => {
    if (sortQuery) {
      try {
        setSort(JSON.parse(sortQuery))
      } catch (error) {
        // console.error('Failed to parse sort from URL query:', error)
      }
    }
  }, [sortQuery])

  useEffect(() => {
    router.push({
      query: {
        ...(query || {}),
        ...(sort.length && { sort: JSON.stringify(sort) }),
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  const currentSort = sort.find((item) => item.field === field)

  const handleSortChange = () => {
    const newSort = [...sort]

    if (currentSort) {
      if (currentSort.value === ASC) {
        newSort.find((item) => item.field === field).value = DESC
      } else if (currentSort.value === DESC) {
        newSort.splice(
          newSort.findIndex((item) => item.field === field),
          1
        )
      }
    } else {
      newSort.push({
        field,
        value: ASC,
        option: 'nulls last',
      })
    }

    setSort(newSort)
  }

  return {
    sort,
    handleSortChange,
    isAscending: currentSort?.value === ASC,
    isDescending: currentSort?.value === DESC,
  }
}

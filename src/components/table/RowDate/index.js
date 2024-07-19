import { useMemo } from 'react'

import { FORMAT_STRING } from '@/constants'

import { cn, formatDate } from '@/utils/helper'

const RowDate = ({ item, unit = FORMAT_STRING.date_str, className = '' }) => {
  const date = useMemo(() => {
    if (!item) {
      return '-'
    }

    return formatDate(item, unit)
  }, [item, unit])

  return <div className={cn('min-w-[138px] text-base', className)}>{date}</div>
}

export default RowDate

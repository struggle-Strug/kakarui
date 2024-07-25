import React from 'react'

import { cn } from '@/utils/helper/functions'

const RowContent = ({ item, className }) => {
  return (
    <div className={cn('line-clamp-5 whitespace-pre-wrap text-base', className)} title={item}>
      {item || '-'}
    </div>
  )
}

export default RowContent

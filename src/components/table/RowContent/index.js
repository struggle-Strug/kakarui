import React from 'react'

import { cn } from '@/utils/helper/functions'

const RowContent = ({ item, className }) => {
  return (
    <div
      className={cn(
        'line-clamp-5 min-w-[128px] max-w-xs whitespace-pre-wrap text-base leading-9',
        className
      )}
      title={item}
    >
      {item || '-'}
    </div>
  )
}

export default RowContent

import { Tooltip } from 'antd'

import React from 'react'

import { cn } from '@/utils/helper/functions'

const RowContent = ({ item, className, showTooltip }) => {
  if (item && showTooltip) {
    return (
      <Tooltip title={item || '-'}>
        <div className={cn('line-clamp-5 whitespace-pre-wrap text-base', className)} title={item}>
          {item || '-'}
        </div>
      </Tooltip>
    )
  }
  return (
    <div className={cn('line-clamp-5 whitespace-pre-wrap text-base', className)} title={item}>
      {item || '-'}
    </div>
  )
}

export default RowContent

import { Timeline as AntdTimeline, Spin } from 'antd'

import { forwardRef } from 'react'

import { cn } from '@/utils/helper/functions'

const Timeline = (
  {
    total,
    loading,
    pagination,
    hasEmpty = false,
    rowClassName,
    className,
    wrapperClassName,
    wrapperStyle,
    columns,
    items = [],
    ...props
  },
  ref
) => {
  if (hasEmpty && !loading && total === 0) {
    return (
      <article className="flex-center">
        <p>一致する結果は見つかりませんでした。</p>
      </article>
    )
  }

  return (
    <Spin spinning={false} wrapperClassName={wrapperClassName} style={wrapperStyle}>
      <AntdTimeline ref={ref} className={cn('', className)} items={items} mode="left" {...props} />
    </Spin>
  )
}

export default forwardRef(Timeline)

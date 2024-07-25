import { Checkbox as AntdCheckbox } from 'antd'

import { forwardRef } from 'react'

import { cn } from '@/utils/helper/functions'

const Checkbox = ({ title, value, ...props }, ref) => {
  return (
    <AntdCheckbox
      ref={ref}
      rootClassName={cn('leading-[40px]', props?.rootClassName)}
      checked={value}
      {...props}
    >
      {title}
    </AntdCheckbox>
  )
}

export default forwardRef(Checkbox)

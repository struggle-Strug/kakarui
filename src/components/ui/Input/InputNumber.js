import { InputNumber as AntdInputNumber } from 'antd'

import { forwardRef } from 'react'

import { cn } from '@/utils/helper/functions'

const InputNumber = (props, ref) => {
  return (
    <AntdInputNumber
      ref={ref}
      size="large"
      placeholder={props?.placeholder || '入力してください。'}
      className={cn('flex', props?.className)}
      {...props}
    />
  )
}

export default forwardRef(InputNumber)

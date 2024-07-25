import { Input as AntdInput } from 'antd'

import { forwardRef } from 'react'

import { PLACEHOLDER_INPUT } from '@/constants'

import { handleKeyDown } from '@/utils/helper/strings'

const Input = (props, ref) => {
  return (
    <AntdInput
      ref={ref}
      size="large"
      placeholder={props?.placeholder || PLACEHOLDER_INPUT}
      onKeyDown={handleKeyDown}
      autoComplete="off"
      {...props}
    />
  )
}

export default forwardRef(Input)

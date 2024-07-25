import { Input as AntdInput } from 'antd'

import { forwardRef } from 'react'

const InputTextArea = (props, ref) => {
  return (
    <AntdInput.TextArea
      ref={ref}
      size="large"
      placeholder={props?.placeholder || '入力してください。'}
      {...props}
    />
  )
}

export default forwardRef(InputTextArea)

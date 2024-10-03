import { Input as AntdInput } from 'antd'

import { forwardRef } from 'react'

import { EyeViewHideIcon, EyeViewIcon } from '@/components/icons'

const iconRender = (visible) => {
  return visible ? <EyeViewIcon size={20} /> : <EyeViewHideIcon size={20} />
}

const InputPassword = ({ ...props }, ref) => {
  return (
    <AntdInput.Password
      ref={ref}
      size="large"
      placeholder={props?.placeholder || '********'}
      iconRender={iconRender}
      onKeyPress={(e) => {
        // TODO: updated
        if (e.key === ' ') {
          e.preventDefault()
        }
      }}
      {...props}
    />
  )
}

export default forwardRef(InputPassword)

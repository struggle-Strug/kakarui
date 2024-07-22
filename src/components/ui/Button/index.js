import { Button as AntdButton, message } from 'antd'
import noop from 'lodash/noop'

import { forwardRef, useId } from 'react'

import { cn } from '@/utils/helper/functions'

import Link from '../Link'

const ANTD_BUTTON_TYPES = ['default', 'primary', 'dashed', 'link', 'text']

const Button = (
  {
    label,
    children,
    size = 'large',
    type = 'primary',
    disabled = false,
    htmlType = 'button',
    linkClassName = '',
    className,
    onClick,
    href,
    ...props
  },
  ref
) => {
  const id = useId()
  const customType = ANTD_BUTTON_TYPES.includes(type) ? type : 'default'

  const customClassName = cn(
    'flex-center',
    {
      '!bg-transparent text-primary !border-0 !font-semibold': type === 'outline',
      'bg-secondary text-white border-secondary': type === 'secondary',
      'bg-success text-white border-success': type === 'success',
      'bg-red text-white border-red': type === 'error',
      'h-8': size === 'small',
    },
    className
  )

  const onClickDefault = () => {
    if (htmlType === 'submit' || href) return
    message.warning('Developing function')
  }

  if (href) {
    return (
      <Link className={cn(linkClassName)} href={href} disabled={disabled}>
        <Button onClick={noop} {...{ ...props, type, size, disabled }}>
          {label || children}
        </Button>
      </Link>
    )
  }

  return (
    <AntdButton
      id={id}
      ref={ref}
      size={size}
      htmlType={htmlType}
      className={cn(customClassName, className)}
      onClick={onClick || onClickDefault}
      disabled={disabled}
      type={customType}
      shape="default"
      {...props}
    >
      {label || children}
    </AntdButton>
  )
}

export default forwardRef(Button)

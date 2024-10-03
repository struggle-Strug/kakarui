import { Radio as AntdRadio } from 'antd'

import { forwardRef } from 'react'

import { cn } from '@/utils/helper/functions'

const getFormatOptions = (options) =>
  (options || []).map(({ label, value, className, ...rest }) => ({
    label,
    value,
    key: value,
    className: cn('flex flex-row items-stretch', className),
    ...rest,
  }))

const Radio = ({ options = [], ...props }, ref) => {
  const defaultValue = props?.defaultValue || options?.[0]?.value
  const value = props?.value?.value

  return (
    <AntdRadio.Group
      ref={ref}
      {...props} // always here
      options={getFormatOptions(options)}
      defaultValue={defaultValue}
      value={value}
    />
  )
}

export default forwardRef(Radio)

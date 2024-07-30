import { forwardRef } from 'react'

import { Input as BaseInput } from '@/components/ui'

import FormItem from '../FormItem'

const Input = (props, ref) => {
  return (
    <FormItem {...props}>
      <BaseInput ref={ref} />
    </FormItem>
  )
}

export default forwardRef(Input)

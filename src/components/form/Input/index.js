import { Input as BaseInput } from '@/components/ui'

import FormItem from '../FormItem'

const Input = (props) => {
  return (
    <FormItem {...props}>
      <BaseInput />
    </FormItem>
  )
}

export default Input

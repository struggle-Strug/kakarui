import { Radio as BaseRadio } from '@/components/ui'

import FormItem from '../FormItem'

const Radio = (props) => {
  return (
    <FormItem {...props}>
      <BaseRadio />
    </FormItem>
  )
}

export default Radio

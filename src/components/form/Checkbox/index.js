import { Checkbox as BaseCheckbox } from '@/components/ui'

import FormItem from '../FormItem'

const Checkbox = (props) => {
  return (
    <FormItem {...props}>
      <BaseCheckbox />
    </FormItem>
  )
}

export default Checkbox

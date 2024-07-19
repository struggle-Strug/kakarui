import { PLACEHOLDER_SELECT } from '@/constants'

import { SelectMulti as BaseSelectMulti } from '@/components/ui'

import FormItem from '../FormItem'

const SelectMulti = ({ ...props }) => {
  return (
    <FormItem {...props}>
      <BaseSelectMulti placeholder={props?.placeholder || PLACEHOLDER_SELECT} />
    </FormItem>
  )
}

export default SelectMulti

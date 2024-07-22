import { Select as AntSelect } from 'antd'

import { PLACEHOLDER_SELECT } from '@/constants'
import { useSelectBodyOverflow } from '@/hooks/custom'

import { ChevronDown } from '@/components/icons'

import FormItem from '../FormItem'

const suffixIcon = <ChevronDown color="var(--primary)" />

const Select = ({ isBlockBody = true, ...props }) => {
  // eslint-disable-next-line no-unused-vars
  const { onDropdownVisibleChange } = useSelectBodyOverflow(isBlockBody)

  return (
    <FormItem {...props}>
      <AntSelect
        size="large"
        suffixIcon={suffixIcon}
        // onDropdownVisibleChange={onDropdownVisibleChange}
        placeholder={props?.placeholder || PLACEHOLDER_SELECT}
      />
    </FormItem>
  )
}

export default Select

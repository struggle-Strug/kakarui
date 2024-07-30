import { Select as AntSelect } from 'antd'

import { forwardRef } from 'react'

import { PLACEHOLDER_SELECT } from '@/constants'
import { useSelectBodyOverflow } from '@/hooks/custom'

import { ChevronDown } from '@/components/icons'

import FormItem from '../FormItem'

const suffixIcon = <ChevronDown color="var(--primary)" />

const Select = ({ isBlockBody = true, ...props }, ref) => {
  // eslint-disable-next-line no-unused-vars
  const { onDropdownVisibleChange } = useSelectBodyOverflow(isBlockBody)

  return (
    <FormItem {...props}>
      <AntSelect
        ref={ref}
        size="large"
        suffixIcon={suffixIcon}
        // onDropdownVisibleChange={onDropdownVisibleChange}
        placeholder={props?.placeholder || PLACEHOLDER_SELECT}
      />
    </FormItem>
  )
}

export default forwardRef(Select)

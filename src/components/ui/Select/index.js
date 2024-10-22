import { Select as AntSelect } from 'antd'

import { forwardRef } from 'react'

import { PLACEHOLDER_SELECT } from '@/constants'
import { useSelectBodyOverflow } from '@/hooks/custom'

import { ChevronDown } from '@/components/icons'

import { cn } from '@/utils/helper/functions'

const Select = ({ isBlockBody = true, mode, ...props }, ref) => {
  // eslint-disable-next-line no-unused-vars
  const { onDropdownVisibleChange } = useSelectBodyOverflow(isBlockBody)

  return (
    <AntSelect
      ref={ref}
      {...props}
      size="large"
      value={props?.value || undefined}
      suffixIcon={<ChevronDown color="var(--primary)" size={24} />}
      placeholder={props?.placeholder || PLACEHOLDER_SELECT}
      // onDropdownVisibleChange={onDropdownVisibleChange}
      className={cn(props?.className)}
      mode={mode}
    />
  )
}

export default forwardRef(Select)

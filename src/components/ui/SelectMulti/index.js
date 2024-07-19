import { Select as AntSelect, Spin } from 'antd'

import { forwardRef } from 'react'

import { useSelectBodyOverflow } from '@/hooks/custom'

import { ChevronDown } from '@/components/icons'

import { filterOption } from '@/utils/helper/functions'

const SelectMulti = (
  { isBlockBody = true, loading = false, multi = true, onChange, ...props },
  ref
) => {
  // eslint-disable-next-line no-unused-vars
  const { onDropdownVisibleChange } = useSelectBodyOverflow(isBlockBody)

  const suffixIcon = loading ? <Spin size="small" /> : <ChevronDown color="var(--primary)" />

  const handleOnChange = (values) => {
    const formatValues = [...new Set(values)]
    onChange(formatValues)
  }

  return (
    <AntSelect
      ref={ref}
      showSearch={multi}
      onChange={handleOnChange}
      mode={multi ? 'tags' : ''}
      // onDropdownVisibleChange={onDropdownVisibleChange}
      filterOption={filterOption}
      suffixIcon={suffixIcon}
      size="large"
      {...props}
    />
  )
}

export default forwardRef(SelectMulti)

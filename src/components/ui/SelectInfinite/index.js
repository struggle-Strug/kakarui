import { Select as AntSelect, Spin } from 'antd'

import { forwardRef } from 'react'

import { useSelectBodyOverflow } from '@/hooks/custom'

import { ChevronDown } from '@/components/icons'

import { cn } from '@/utils/helper/functions'

const { Option } = AntSelect

export const SelectInfinite = (
  {
    placeholder = '選択してください。',
    isBlockBody = true,
    className = '',
    options,
    mode,
    //
    loading,
    onLoadMore,
    ...props
  },
  ref
) => {
  // eslint-disable-next-line no-unused-vars
  const { onDropdownVisibleChange } = useSelectBodyOverflow(isBlockBody)

  const onScroll = async (event) => {
    const { target } = event || {}

    if (!loading && target.scrollTop + target.offsetHeight === target.scrollHeight) {
      target.scrollTo(0, target.scrollHeight)
      onLoadMore?.()
    }
  }

  return (
    <AntSelect
      ref={ref}
      {...props}
      loading={loading}
      onPopupScroll={onScroll}
      //
      size="large"
      // onDropdownVisibleChange={onDropdownVisibleChange}
      suffixIcon={<ChevronDown color="var(--main)" size={10} />}
      value={loading || options?.length ? props?.value || undefined : undefined}
      placeholder={placeholder}
      className={cn(className)}
      mode={mode}
    >
      {(options || []).map(({ label, value }) => (
        <Option key={value} value={value}>
          {label}
        </Option>
      ))}
      {loading ? (
        <Option>
          <div key="last" className="flex-center py-1">
            <Spin size="small" />
          </div>
        </Option>
      ) : null}
    </AntSelect>
  )
}

export default forwardRef(SelectInfinite)

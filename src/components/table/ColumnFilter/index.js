import { Checkbox, Radio, Space } from 'antd'
import noop from 'lodash/noop'

import { useState } from 'react'

import { InfiniteList } from '@/components/common'
import { Button } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const ColumnFilter = ({
  field,
  value,
  isMultiple = false,
  options,
  setFilter,
  confirm,
  close,
  loadMore = noop,
  isFetchingNextPage = false,
  hasNextPage = false,
  className,
}) => {
  const [currentValue, setCurrentValue] = useState(value || [])

  const onChange = (e) => {
    if (isMultiple) {
      setCurrentValue(e || [])
    } else {
      setCurrentValue(e?.target?.value)
    }
  }

  const onClearFilter = () => {
    setCurrentValue(isMultiple ? [] : null)
    setFilter((prev) => ({ ...prev, [field]: isMultiple ? [] : null }))
    close?.()
  }

  const onOk = () => {
    setFilter((prev) => ({ ...prev, [field]: currentValue }))
    confirm?.()
  }

  const footer = (
    <Space className="flex w-full flex-row justify-around gap-6 px-4 py-3">
      <Button type="default" shape="square" size="small" onClick={onClearFilter}>
        リセット
      </Button>
      <Button type="primary" shape="square" size="small" onClick={onOk}>
        はい
      </Button>
    </Space>
  )

  if (isMultiple) {
    return (
      <InfiniteList
        data={options}
        loadMore={loadMore}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        footer={footer}
      >
        <Space className="p-6" direction="vertical">
          <Checkbox.Group
            options={options}
            className={cn('flex flex-col gap-3', className)}
            onChange={onChange}
            value={currentValue}
          />
        </Space>
      </InfiniteList>
    )
  }

  const renderItem = ({ label, value: _value }) => (
    <Radio key={label} value={_value} title={label} className="w-full">
      {label}
    </Radio>
  )

  return (
    <Radio.Group onChange={onChange} value={currentValue} className={cn('z-50', className)}>
      <Space
        className="max-h-80 w-full overflow-y-auto overflow-x-hidden scroll-smooth px-4 py-3"
        direction="vertical"
      >
        {(options || []).map(renderItem)}
      </Space>
      {footer}
    </Radio.Group>
  )
}

export default ColumnFilter

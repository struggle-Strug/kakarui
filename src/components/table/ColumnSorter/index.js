import { Space } from 'antd'

import { useCustomRowSort } from '@/hooks/custom'

import { SortedDownIcon, SortedUpIcon } from '@/components/icons'

import { cn } from '@/utils/helper/functions'

const ColumnSorter = ({ title, field, className }) => {
  const { handleSortChange, isAscending, isDescending } = useCustomRowSort({ field })

  return (
    <Space
      size={0}
      className={cn('flex min-w-max cursor-pointer items-center justify-between gap-4', className)}
      onClick={handleSortChange}
    >
      <span className="text-base">{title}</span>
      <Space size={0} direction="vertical">
        <SortedUpIcon size={16} color={isAscending ? 'var(--primary)' : 'var(--outline)'} />
        <SortedDownIcon
          color={isDescending ? 'var(--primary)' : 'var(--outline)'}
          style={{ marginTop: -6 }}
          size={16}
        />
      </Space>
    </Space>
  )
}

export default ColumnSorter

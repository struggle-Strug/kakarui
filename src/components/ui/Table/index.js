import { Table as AntdTable, Spin } from 'antd'

import { forwardRef } from 'react'

import { cn } from '@/utils/helper/functions'

const Table = (
  { total, loading, rowKey = 'id', rowClassName, pagination, className, columns, data, ...props },
  ref
) => {
  const _pagination =
    typeof pagination === 'object'
      ? {
          defaultPageSize: 30,
          showQuickJumper: false,
          showSizeChanger: false,
          ...(pagination || {}),
        }
      : pagination

  return (
    <Spin spinning={false}>
      <AntdTable
        ref={ref}
        bordered
        {...props}
        rowKey={rowKey}
        loading={loading}
        pagination={_pagination}
        rowClassName={rowClassName}
        className={cn(className)}
        dataSource={data || []}
        columns={columns}
      />
    </Spin>
  )
}

export default forwardRef(Table)

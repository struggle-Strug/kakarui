import { List, Spin } from 'antd'

import { useId } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { cn } from '@/utils/helper/functions'

const InfiniteList = ({
  children,
  height,
  //
  data,
  loading,
  hasNextPage,
  isFetchingNextPage,
  loadMore,
  //
  className,
  listClassName,
  renderItem,
}) => {
  const id = useId()

  const rootClassName = cn('w-full overflow-x-hidden overflow-y-auto scroll-smooth', className)
  const style = { ...(!height ? { height: 'max-content' } : { height: height || 500 }) }

  const loader = isFetchingNextPage ? (
    <li className="flex-center">
      <Spin className="my-4" />
    </li>
  ) : null

  const renderList = (
    <List
      className={listClassName}
      dataSource={data || []}
      renderItem={renderItem}
      loading={loading}
    />
  )

  return (
    <div id={id} className={rootClassName} style={style}>
      <InfiniteScroll
        scrollableTarget={id}
        hasMore={hasNextPage}
        dataLength={data?.length || 0}
        showLoader={isFetchingNextPage}
        next={loadMore}
        loader={loader}
      >
        {typeof renderItem === 'function' ? renderList : children}
      </InfiniteScroll>
    </div>
  )
}

export default InfiniteList

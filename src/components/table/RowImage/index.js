import { Image } from 'antd'

import { useMemo } from 'react'

import { cn } from '@/utils/helper/functions'

const RowImage = ({ item, size = 96, style = {}, className = '' }) => {
  const image = useMemo(() => {
    if (!item) {
      return '-'
    }

    return (
      <Image
        src={item}
        style={{
          objectFit: 'cover',
          ...style,
        }}
        height={size}
        alt="image"
      />
    )
  }, [item, style, size])

  return <div className={cn(`min-w-[96px] text-center`, className)}>{image}</div>
}

export default RowImage

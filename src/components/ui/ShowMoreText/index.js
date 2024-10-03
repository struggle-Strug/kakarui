import { Interweave } from 'interweave'

import { forwardRef, useEffect, useRef, useState } from 'react'
import ReactShowMoreText from 'react-show-more-text'

import { cn, mergeRefs } from '@/utils/helper/functions'

const ShowMoreText = (
  {
    text,
    value,
    lines = 2,
    moreText = '開く',
    leftText = '閉じる',
    rootClassName = '',
    className = '',
    ...props
  },
  ref
) => {
  const divRef = useRef(null)

  const [width, setWidth] = useState(0)

  useEffect(() => divRef.current && setWidth(Number(divRef.current.offsetWidth)), [])

  return (
    <div
      ref={mergeRefs([ref, divRef])}
      className={cn('w-full whitespace-pre-wrap break-words', rootClassName, className)}
    >
      <ReactShowMoreText
        lines={lines}
        width={width || 200}
        more={<span className="cursor-pointer text-[var(--primary)]">{moreText}</span>}
        less={<span className="cursor-pointer text-[var(--primary)]">{leftText}</span>}
        expanded={false}
        {...props}
      >
        <Interweave content={`${(text || value)?.trim()}`} />
      </ReactShowMoreText>
    </div>
  )
}

export default forwardRef(ShowMoreText)

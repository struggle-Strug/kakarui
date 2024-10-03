import { Image as AntAvatar } from 'antd'

import { forwardRef } from 'react'

import { cn } from '@/utils/helper/functions'

const SVGDefaultAvatar = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
      fill="var(--background)"
    />
    <path
      d="M43.2595 38.3031C41.0212 35.3064 38.1147 32.873 34.7711 31.1965C31.4276 29.5199 27.739 28.6463 23.9986 28.6452C20.2582 28.644 16.5692 29.5153 13.2245 31.1897C9.87988 32.8642 6.9719 35.2957 4.73169 38.291C6.96051 41.3015 9.86374 43.7479 13.2086 45.4339C16.5534 47.12 20.2468 47.9989 23.9926 48C27.7383 48.0012 31.4323 47.1247 34.7781 45.4407C38.124 43.7567 41.0288 41.3122 43.2595 38.3031Z"
      fill="var(--primary)"
    />
    <path
      d="M23.9998 25.5484C29.1307 25.5484 33.2901 21.389 33.2901 16.2581C33.2901 11.1272 29.1307 6.96774 23.9998 6.96774C18.8689 6.96774 14.7095 11.1272 14.7095 16.2581C14.7095 21.389 18.8689 25.5484 23.9998 25.5484Z"
      fill="var(--primary)"
    />
  </svg>
)

const Avatar = (props, ref) => {
  const { src, size = 40, shape = true, preview = false, className, ...rest } = props || {}
  const wrapperClassName = cn({ 'rounded-full overflow-hidden': shape })

  const avatarProps = {
    ref,
    src,
    width: size,
    height: size,
    wrapperClassName,
    className: cn('object-cover rounded-md', className),
    preview,
    ...rest,
  }

  return (
    <div ref={ref} className={cn('shadow-media-inner rounded-md', wrapperClassName)}>
      {src ? <AntAvatar {...avatarProps} /> : <SVGDefaultAvatar size={size} />}
    </div>
  )
}

export default forwardRef(Avatar)

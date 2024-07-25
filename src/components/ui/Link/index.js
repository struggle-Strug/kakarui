import NextLink from 'next/link'
import { forwardRef } from 'react'

const Link = ({ disabled, children, ...props }, ref) => {
  if (disabled) {
    return children
  }

  return (
    <NextLink ref={ref} prefetch={false} {...props}>
      {children}
    </NextLink>
  )
}

export default forwardRef(Link)

import { Link } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const RowTextLink = ({ children, text, pathname, query, disabled, className }) => {
  if (!children && !text) return '-'

  return (
    <Link href={{ pathname, query }} disabled={disabled}>
      <div
        className={cn(
          'h-10 text-base leading-9',
          {
            'cursor-not-allowed': disabled,
          },
          className
        )}
      >
        {children || text}
      </div>
    </Link>
  )
}

export default RowTextLink

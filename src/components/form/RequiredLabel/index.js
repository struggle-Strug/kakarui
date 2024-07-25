import { cn } from '@/utils/helper/functions'

const RequiredLabel = ({ label, classNames }) => (
  <div className={cn('flex-between shrink-0 items-start gap-2 pr-8 text-left text-sm', classNames)}>
    <span className="flex-1 break-words">{label}</span>
    <span className="shrink-0 rounded border border-solid border-error px-1.5 pb-1 pt-[3px] text-[11px] leading-[11px] text-error">
      必須
    </span>
  </div>
)

export default RequiredLabel

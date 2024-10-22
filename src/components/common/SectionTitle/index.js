import { cn } from '@/utils/helper/functions'

const SectionTitle = ({ title, className }) => {
  return (
    <h3 className={cn('mb-2 text-lg font-semibold sm:col-span-2 lg:col-span-4', className)}>
      <span>{title}</span>
    </h3>
  )
}

export default SectionTitle

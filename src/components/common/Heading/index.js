import { cn } from '@/utils/helper'

/**
 * A component that renders a header with an optional icon, subtitle, and extra content.
 *
 * @param {string} title - The main title of the header.
 * @param {string} subTitle - An optional subtitle for the header.
 * @param {React.ReactNode} icon - An optional icon to display next to the title.
 * @param {React.ReactNode} extra - Optional extra content to display on the right side of the header.
 * @param {string} className - Optional additional class names to apply to the header.
 * @returns {JSX.Element} The rendered header component.
 */

const Heading = ({ title, subTitle, icon, extra, className }) => (
  <header
    className={cn(
      'flex items-center justify-between gap-2 rounded-t-lg bg-gray p-3',
      'lg:flex-row',
      className
    )}
  >
    <div className="flex items-center gap-2 text-primary">
      {icon && <div>{icon}</div>}
      <div>
        <h1 className="inline text-base font-bold">{title}</h1>
        {subTitle && <b className="text-base">{subTitle}</b>}
      </div>
    </div>
    {extra && <div>{extra}</div>}
  </header>
)

export default Heading

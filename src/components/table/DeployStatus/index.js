import { DEPLOY_STATUS, DEPLOY_STATUS_TEXT } from '@/constants'

import { cn } from '@/utils/helper/functions'

const DeployStatus = ({ status, className, contentClassName }) => {
  if (!status) return null

  const statusData = {
    [DEPLOY_STATUS.COMPLETE]: {
      style: 'bg-success border-[#5F7E65]',
      content: DEPLOY_STATUS_TEXT?.[DEPLOY_STATUS.COMPLETE] || status,
    },
    [DEPLOY_STATUS.PENDING]: {
      style: 'bg-pending border-[#7E615F]',
      content: DEPLOY_STATUS_TEXT?.[DEPLOY_STATUS.PENDING] || status,
    },
    [DEPLOY_STATUS.IN_PROGRESS]: {
      style: 'bg-in-progress border-[#5F7E65]',
      content: DEPLOY_STATUS_TEXT?.[DEPLOY_STATUS.IN_PROGRESS] || status,
    },
  }?.[status]

  return (
    <div className={cn('flex items-center gap-2 text-base', className)}>
      <div
        className={cn(
          'h-[25px] min-h-[25px] w-[25px] min-w-[25px] rounded-full border border-solid',
          statusData?.style
        )}
      />
      <div className={cn('ml-3', contentClassName)}>{statusData?.content}</div>
    </div>
  )
}

export default DeployStatus

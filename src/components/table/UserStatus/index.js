import { USER_STATUS, USER_STATUS_TEXT } from '@/constants'

import { cn } from '@/utils/helper/functions'

const UserStatus = ({ status }) => {
  if (!status) return null

  const statusData = {
    [USER_STATUS.ACTIVE]: {
      style: 'bg-success',
      content: USER_STATUS_TEXT[USER_STATUS.ACTIVE],
    },
    [USER_STATUS.BANNED]: {
      style: 'bg-red',
      content: USER_STATUS_TEXT[USER_STATUS.BANNED],
    },
    [USER_STATUS.DELETED]: {
      style: 'bg-red',
      content: USER_STATUS_TEXT[USER_STATUS.DELETED],
    },
  }?.[status]

  return (
    <div
      className={cn(
        'mx-auto rounded-full px-4 py-0.5 text-center text-sm leading-5 text-white',
        statusData?.style
      )}
    >
      {statusData?.content}
    </div>
  )
}

export default UserStatus

import { forwardRef } from 'react'

import Avatar from '../Avatar'

const AvatarDouble = ({ avatars = [] }, ref) => {
  return (
    <article ref={ref} role="img" className="relative h-14 w-14">
      <div className="absolute right-0 top-0 z-10">
        <Avatar size={37} src={avatars[0]} />
      </div>
      <div className="absolute bottom-0 left-0 z-20 rounded-full border border-solid border-white bg-light-gray">
        <Avatar size={37} src={avatars[1]} />
      </div>
    </article>
  )
}

export default forwardRef(AvatarDouble)

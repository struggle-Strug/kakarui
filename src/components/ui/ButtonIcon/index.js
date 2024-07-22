import { Button, message } from 'antd'

import { forwardRef } from 'react'

const onClickDefault = () => {
  message.warning('Developing function')
}

const ButtonIcon = ({ icon, onClick, ...props }, ref) => {
  return <Button ref={ref} type="text" icon={icon} onClick={onClick || onClickDefault} {...props} />
}

export default forwardRef(ButtonIcon)

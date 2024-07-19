import { Popconfirm } from 'antd'

import { QuestionIcon } from '@/components/icons'

const ConfirmPopup = (props) => {
  const {
    children,
    icon,
    title = '',
    okText = 'はい',
    cancelText = 'キャンセル',
    loading = false,
    onConfirm,
    onCancel,
    open,
  } = props

  return (
    <Popconfirm
      open={open}
      title={title}
      okText={okText}
      cancelText={cancelText}
      icon={icon || <QuestionIcon color="red" />}
      okButtonProps={{ loading, size: 'middle' }}
      cancelButtonProps={{ size: 'middle' }}
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    >
      {children}
    </Popconfirm>
  )
}

export default ConfirmPopup

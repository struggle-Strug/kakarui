import { Space, message } from 'antd'

import { CheckIcon, EditIcon, RejectIcon, SendIcon, TrashIcon } from '@/components/icons'
import { Button, ButtonIcon } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const defaultClick = () => message.warning('Developing function')

const TableActions = ({
  col = false,
  onCheck,
  showCheck = true,
  onEdit,
  showEdit = true,
  onDelete,
  showDelete = true,
  onApprove,
  showApprove = true,
  onReject,
  showReject = true,
  onSend,
  showSend = true,
  className,
  extra,
}) => {
  const actions = [
    onCheck && showCheck && { icon: CheckIcon, onClick: onCheck },
    onEdit && showEdit && { icon: EditIcon, onClick: onEdit },
    onApprove && showApprove && { icon: CheckIcon, onClick: onApprove },
    onReject && showReject && { icon: RejectIcon, onClick: onReject },
    onDelete && showDelete && { icon: TrashIcon, onClick: onDelete },
    onSend && showSend && { icon: SendIcon, onClick: onSend },
  ].filter(Boolean)

  const renderItem = (action, index) => {
    const { label, onClick = defaultClick, icon: Icon, ...props } = action || {}
    const buttonProps = { ...props, onClick, icon: <Icon /> }

    return !label ? (
      <ButtonIcon key={index} {...buttonProps} />
    ) : (
      <Button key={index} size="small" label={label} {...buttonProps} />
    )
  }

  return (
    <Space className={cn('w-full justify-center', { 'flex-col': col }, className)}>
      {actions.map(renderItem)}
      {typeof extra === 'function' ? extra?.() : extra}
    </Space>
  )
}

export default TableActions

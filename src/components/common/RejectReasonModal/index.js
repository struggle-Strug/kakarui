import { Modal, Spin } from 'antd'

import { useCallback, useDeferredValue, useState } from 'react'

import InputTextArea from '@/components/ui/Input/InputTextArea'

import { handleKeyDown } from '@/utils/helper/strings'

const RejectReasonModal = ({ title, open, onClose, onReject, loading }) => {
  const [reason, setReason] = useState('')
  let reasonValue = useDeferredValue(reason)
  reasonValue = reasonValue?.trim?.()

  const onChange = useCallback(
    (e) => {
      setReason(e.target.value)
    },
    [setReason]
  )

  const onKeyDown = useCallback(
    (e) => {
      handleKeyDown(e, onReject(reasonValue))
    },
    [onReject, reasonValue]
  )

  const handleCancel = useCallback(() => {
    setReason('')
    onClose?.()
  }, [setReason, onClose])

  return (
    <Modal
      open={open}
      title={title || '却下理由'}
      onOk={() => !!reasonValue && onReject(reasonValue)}
      okButtonProps={{ disabled: !reasonValue }}
      afterClose={handleCancel}
      onCancel={handleCancel}
      width={520}
      centered
    >
      <Spin spinning={loading}>
        <legend>
          <label>理由</label>
          <InputTextArea
            placeholder="理由を入力してください。"
            onKeyDown={onKeyDown}
            onChange={onChange}
            value={reason}
          />
        </legend>
      </Spin>
    </Modal>
  )
}

export default RejectReasonModal

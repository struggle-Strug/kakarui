import { Modal, Space } from 'antd'

import { useCopyToClipboard, useFlag } from '@/hooks/share'

import { CopyIcon, ExternalLinkIcon } from '@/components/icons'
import { Button, ButtonIcon } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

import RowContent from '../RowContent'

const RowContentModal = ({ item, className, copyContent, isShowModal = true }) => {
  const [open, onOpen, onClose] = useFlag()
  const [, onCopy] = useCopyToClipboard()

  const renderFooter = (
    <Space className="pb-3 pr-4">
      <Button
        icon={<CopyIcon className="text-[28px]" />}
        onClick={() => onCopy(copyContent || item)}
        type="text"
      >
        <b>コピー</b>
      </Button>
    </Space>
  )

  return (
    <>
      <Space className="flex-between">
        <RowContent item={item} className={cn('line-clamp-3', className)} />
        {item ? (
          <ButtonIcon
            icon={<ExternalLinkIcon size={32} />}
            disabled={!isShowModal}
            onClick={onOpen}
          />
        ) : null}
      </Space>
      <Modal
        centered
        title="メッセージ"
        className="row_content_modal"
        footer={renderFooter}
        onCancel={onClose}
        open={open}
      >
        <div className="px-4 py-3 text-base">{item}</div>
      </Modal>
    </>
  )
}

export default RowContentModal

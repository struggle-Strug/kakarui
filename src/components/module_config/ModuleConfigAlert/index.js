import { Modal } from 'antd'

import { AiOutlineExclamationCircle } from 'react-icons/ai'

import { Button } from '@/components/ui'

const ModuleConfigAlert = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onCancel={() => onClose()}
      title={
        <h1 className="flex items-center justify-start text-lg font-semibold text-dark-gray-3">
          <AiOutlineExclamationCircle />
          モジュール配置が存在ません。
        </h1>
      }
      className="rounded-3xl"
      footer={null}
      width={698}
    >
      <p className="px-12 text-lg font-light text-primary">該当モジュール配置は削除されました。</p>
      <div className="flex justify-center gap-x-4 px-12 py-8">
        <Button
          type="primary"
          htmlType="submit"
          className="min-w-[200px]"
          onClick={() => onClose()}
        >
          <span className="font-semibold">OK</span>
        </Button>
      </div>
    </Modal>
  )
}

export default ModuleConfigAlert

import { Modal } from 'antd'

import { cloneElement, useEffect } from 'react'

import { useGetMe } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { HeadNext } from '@/components/common'

import SaveSequence from '..'

const SaveSequenceModal = ({ children, isEdit, data, nodes }) => {
  const [open, onOpen, onClose] = useFlag()

  const { isAcceptedDeployment } = useGetMe()

  const title = isEdit ? 'シーケンス' : 'シーケンス'
  useEffect(() => {
    console.log(nodes);

  }, [nodes])
  return (
    <>
      <div role="presentation" onClick={onOpen}>
        {cloneElement(children, {
          ...children.props,
          disabled: !isAcceptedDeployment,
        })}
      </div>

      {open ? (
        <Modal
          open={open}
          onCancel={onClose}
          title={<h1 className="text-xl font-semibold text-dark-gray-3">シーケンス保存</h1>}
          className="rounded-3xl"
          footer={null}
          width={576}
        >
          <HeadNext title={title} />
          <p className="px-10 text-lg font-light text-primary">シーケンスを登録します。<br />シーケンス名が既に存在する場合、上書き保存されます。</p>
          <div className="p-12 pt-5 font-light">
            <SaveSequence isEdit={isEdit} data={data} nodes={nodes} onClose={onClose} projectId={'48367204-bc4f-4c56-b00c-1ed331e7c8c1'} moduleConfigId={'4fd29a4b-08a6-436a-b748-a7d95ce16dba'} />
          </div>
        </Modal>
      ) : null}
    </>
  )
}

export default SaveSequenceModal

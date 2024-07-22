import { Modal, Spin } from 'antd'

import { ACTIVE_STATUS } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import { useFlag } from '@/hooks/share'
import userApiStub from '@/hooks/stub/user'

import { EditIcon } from '@/components/icons'
import { ButtonIcon } from '@/components/ui'

import UserForm from '../UserForm'

const UserUpdateModalButton = ({ data, onSuccess, ...props }) => {
  const [open, onOpen, onClose] = useFlag()
  const [loading, startLoading] = useLoadingSimulation()

  const onUpdateUser = async (values) => {
    const updateData = {
      ...values,
      main_role: values.role,
      enable: values.status === ACTIVE_STATUS.ENABLE.toString(),
      update_date: new Date().toISOString(),
    }

    await userApiStub.updateUser(data.id, updateData)
    startLoading(() => {
      onSuccess?.()
      onClose()
    })
  }

  return (
    <>
      <ButtonIcon icon={<EditIcon size={32} />} onClick={onOpen} />
      {open && (
        <Modal
          open={open}
          onCancel={onClose}
          title={<h1 className="text-lg font-semibold text-dark-gray-3">ユーザー変更</h1>}
          className="rounded-3xl"
          footer={null}
          width={698}
        >
          <p className="px-12 text-lg font-light text-primary">ユーザ情報の変更を行います。</p>
          <Spin spinning={loading}>
            <div className="p-12 font-light">
              <UserForm isEdit {...props} data={data} onAddEdit={onUpdateUser} onClose={onClose} />
            </div>
          </Spin>
        </Modal>
      )}
    </>
  )
}

export default UserUpdateModalButton

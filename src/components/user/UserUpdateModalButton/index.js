import { Modal, Spin } from 'antd'

import Head from 'next/head'

import { ACTIVE_STATUS, USER_ROLE } from '@/constants'
import { useUserUpdate } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { EditIcon } from '@/components/icons'
import { ButtonIcon } from '@/components/ui'

import UserForm from '../UserForm'

const UserUpdateModalButton = ({ data, onSuccess, ...props }) => {
  const [open, onOpen, onClose] = useFlag()

  const { doUpdateUser, isPending: updateLoading } = useUserUpdate({
    userId: data?.entra_id,
    onSuccess: () => {
      onSuccess?.()
      onClose()
    },
  })

  const onUpdateUser = async (values) => {
    const { name, mail, company, status } = values || {}

    const role = values?.role === USER_ROLE.SYSTEM_ADMIN ? USER_ROLE.SYSTEM_ADMIN : null
    const enable = status === ACTIVE_STATUS.ENABLE.toString()

    const newUser = { name, mail, company, role, enable }

    doUpdateUser(newUser)
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
          <Head>
            <title>ユーザー変更</title>
          </Head>
          <p className="px-12 text-lg font-light text-primary">ユーザ情報の変更を行います。</p>
          <Spin spinning={!!updateLoading}>
            <div className="p-12 font-light">
              <UserForm
                isEdit
                {...props}
                data={data}
                onAddEdit={onUpdateUser}
                loading={!!updateLoading}
                onClose={onClose}
              />
            </div>
          </Spin>
        </Modal>
      )}
    </>
  )
}

export default UserUpdateModalButton

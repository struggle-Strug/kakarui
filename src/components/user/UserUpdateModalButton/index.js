import { Modal, Spin } from 'antd'

import Head from 'next/head'

import { ACTIVE_STATUS, USER_ROLE } from '@/constants'
import { usePermissionUpdate, useUserUpdate } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { EditIcon } from '@/components/icons'
import { ButtonIcon } from '@/components/ui'

import UserForm from '../UserForm'

const UserUpdateModalButton = ({ data, onSuccess, ...props }) => {
  const [open, onOpen, onClose] = useFlag()

  const { doUpdateUser, isPending: updateLoading } = useUserUpdate({
    userId: data?.entra_id,
  })

  const { doUpdatePermission, isPending: updatePermissionLoading } = usePermissionUpdate({
    userId: data?.user_id,
    organizationUserId: data?.id,
  })

  const onUpdateUser = async (values) => {
    const { name, mail, company, status, main_role: mainRole, sub_role: subRole } = values || {}

    const role = values?.role === USER_ROLE.SYSTEM_ADMIN ? USER_ROLE.SYSTEM_ADMIN : null
    const enable = status === ACTIVE_STATUS.ENABLE.toString()

    const userUpdate = { name, mail, company, role, enable }

    doUpdateUser(userUpdate)

    try {
      await doUpdateUser(data)

      await doUpdatePermission({
        main_role: mainRole,
        sub_role: subRole ? USER_ROLE.DEPLOY_ADMIN : null,
      })
      message.success('処理完了しました。')
      onSuccess?.()
      onClose()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating user:', error)
    }
  }

  const updating = updateLoading || updatePermissionLoading

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
          <Spin spinning={updating}>
            <div className="p-12 font-light">
              <UserForm
                isEdit
                {...props}
                data={data}
                onAddEdit={onUpdateUser}
                loading={updating}
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

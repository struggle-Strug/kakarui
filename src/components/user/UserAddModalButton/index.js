import { Modal, Spin } from 'antd'

import Head from 'next/head'

import { USER_ROLE } from '@/constants'
import { usePermissionAdd, useUserCreate } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { AddIcon } from '@/components/icons'
import { Button } from '@/components/ui'

import UserForm from '../UserForm'

const UserAddModalButton = ({ children, onSuccess, ...props }) => {
  const [open, onOpen, onClose] = useFlag()

  const { doCreateUser, isPending: createLoading } = useUserCreate({})

  const { doAddPermission, isPending: addPermissionLoading } = usePermissionAdd()

  const onAddUser = async (values) => {
    const { name, mail, company, sub_role: subRole } = values || {}
    const newUser = { name, mail, company, role: null } // role always null

    try {
      const userResponse = await doCreateUser(newUser)
      const newUserId = userResponse?.data?.id

      if (newUserId) {
        await doAddPermission({
          user_id: newUserId,
          main_role: USER_ROLE.MEMBER,
          sub_role: subRole ? USER_ROLE.DEPLOY_ADMIN : null,
        })
      }
      message.success('処理完了しました。')

      onSuccess?.()
      onClose()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating user:', error)
    }
  }

  const loading = createLoading || addPermissionLoading

  return (
    <>
      <Button icon={<AddIcon size={36} />} type="outline" label="ユーザー招待" onClick={onOpen} />
      {open && (
        <Modal
          open={open}
          onCancel={onClose}
          title={<h1 className="text-lg font-semibold text-dark-gray-3">ユーザー招待</h1>}
          className="rounded-3xl"
          footer={null}
          width={698}
        >
          <Head>
            <title>ユーザー招待</title>
          </Head>
          <p className="px-12 text-lg font-light text-primary">
            組織に招待するユーザの情報を入力してください。
          </p>
          <Spin spinning={loading}>
            <div className="p-12 pr-20 font-light">
              <UserForm onAddEdit={onAddUser} {...props} onClose={onClose} loading={loading} />
            </div>
          </Spin>
        </Modal>
      )}
    </>
  )
}

export default UserAddModalButton

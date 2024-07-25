import { Modal, Spin } from 'antd'

import Head from 'next/head'

import { USER_ROLE } from '@/constants'
import { useUserCreate } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { AddIcon } from '@/components/icons'
import { Button } from '@/components/ui'

import UserForm from '../UserForm'

const UserAddModalButton = ({ children, onSuccess, ...props }) => {
  const [open, onOpen, onClose] = useFlag()

  const { doCreateUser, isPending: createLoading } = useUserCreate({
    onSuccess: () => {
      onClose()
      onSuccess?.()
    },
  })

  const onAddUser = async (values) => {
    const { name, mail, company } = values || {}

    const role = values?.role === USER_ROLE.SYSTEM_ADMIN ? USER_ROLE.SYSTEM_ADMIN : null

    const newUser = { name, mail, company, role }

    doCreateUser(newUser)
  }

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
          <Spin spinning={!!createLoading}>
            <div className="p-12 pr-20 font-light">
              <UserForm
                onAddEdit={onAddUser}
                {...props}
                onClose={onClose}
                loading={!!createLoading}
              />
            </div>
          </Spin>
        </Modal>
      )}
    </>
  )
}

export default UserAddModalButton

import { Modal, Spin, message } from 'antd'

import Head from 'next/head'

import { ACTIVE_STATUS, USER_ROLE } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import { useFlag } from '@/hooks/share'
import userApiStub from '@/hooks/stub/user'

import { AddIcon } from '@/components/icons'
import { Button } from '@/components/ui'

import { uuidv4 } from '@/utils/helper'

import UserForm from '../UserForm'

const UserAddModalButton = ({ children, onSuccess, ...props }) => {
  const [open, onOpen, onClose] = useFlag()
  const [loading, startLoading] = useLoadingSimulation()

  const onAddUser = async (values) => {
    const newUser = {
      id: uuidv4(),
      organization_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      user_id: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
      create_user: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      create_date: new Date().toISOString(),
      update_user: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      update_date: new Date().toISOString(),
      role: USER_ROLE.MEMBER,
      main_role: values.role || USER_ROLE.MEMBER,
      ...values,
      status: ACTIVE_STATUS.ENABLE.toString(),
      enable: true,
    }

    try {
      await userApiStub.addUser(newUser)
      startLoading(() => {
        onSuccess?.()
        onClose()
      })
    } catch (error) {
      message.error(error?.message)
    }
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
          <Spin spinning={loading}>
            <div className="p-12 pr-20 font-light">
              <UserForm onAddEdit={onAddUser} {...props} onClose={onClose} />
            </div>
          </Spin>
        </Modal>
      )}
    </>
  )
}

export default UserAddModalButton

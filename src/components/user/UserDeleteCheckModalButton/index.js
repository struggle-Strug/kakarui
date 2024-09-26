import { Form, Modal, message } from 'antd'

import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ACTIVE_STATUS, ACTIVE_STATUS_OPTIONS, USER_ROLE_OPTIONS } from '@/constants'
import { useAuth, usePermissionDelete, useUserDelete, useUserDetail } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { Checkbox, Input, Select } from '@/components/form'
import { TrashIcon } from '@/components/icons'
import { Button, ButtonIcon } from '@/components/ui'

import { FORM_INFO } from '@/validations/userSchema'

const formText = {
  title: 'ユーザー削除確認',
  description: '以下のユーザを削除します',
  description2: '削除したユーザが作成したモジュールはそのまま残留します。',
  company_name_label: '会社名:',
  name_label: '氏名:',
  email_label: 'メールアドレス:',
  role_label: 'ロール:',
  status_label: 'ステータス:',
  sub_role_label: 'サブロール:',
  delete_button: ' 削除 ',
  cancel_button: 'キャンセル',
}

const UserDeleteModalForm = ({ open, onClose, data, onSuccess }) => {
  const { data: user } = useUserDetail({ userId: data?.entra_id })
  const { organizations = [] } = user || {}

  const [userCount, setUserCount] = useState(null)

  const { doDeleteUser, isPending } = useUserDelete({
    onSuccess: () => {
      message.success('ユーザを削除しました。')
      onClose()
      onSuccess?.()
    },
  })

  const { doDeletePermission } = usePermissionDelete({
    onSuccess: () => {
      if (userCount !== 1) {
        message.success('ユーザを削除しました。')
        onClose()
      }
      onSuccess?.()
    },
  })

  const onSubmit = async (values) => {
    try {
      const totalOrgs = organizations?.length || 0
      setUserCount(totalOrgs)

      // Ensure PermissionDelete is called first
      await doDeletePermission(values)

      // Check if the user belongs to only one organization
      if (totalOrgs === 1) {
        // Call UserDelete if the user is in only one organization
        await doDeleteUser(values)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error delete user:', error)
    }
  }
  const defaultValues = useMemo(
    () => ({
      ...(data || {}),
    }),
    [data]
  )

  const role = data?.main_role

  const methods = useForm(defaultValues)

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const renderForm = (
    <FormProvider {...methods}>
      <Form
        onFinish={methods.handleSubmit(onSubmit)}
        labelCol={{ flex: '172px' }}
        wrapperCol={{ flex: 1 }}
        layout="horizontal"
        labelAlign="left"
        colon={false}
        labelWrap
        disabled
      >
        <Input
          name={FORM_INFO.COMPANY}
          label={formText.company_name_label}
          placeholder="会社名を入力してください。"
          disabled
        />

        <Input
          name={FORM_INFO.NAME}
          label={formText.name_label}
          placeholder="氏名を入力してください。"
          disabled
        />

        <Input
          name={FORM_INFO.EMAIL}
          label={formText.email_label}
          placeholder="メールアドレスを入力してください。"
          disabled
        />

        <Select
          name={FORM_INFO.ROLE}
          label={formText.role_label}
          options={USER_ROLE_OPTIONS}
          placeholder="ロールを選択してください。"
          defaultValue={role}
          disabled
        />

        <Checkbox
          name={FORM_INFO.SUB_ROLE}
          label={formText.sub_role_label}
          title="デプロイ管理者"
          disabled
        />

        <Select
          name="status"
          label={formText.status_label}
          options={ACTIVE_STATUS_OPTIONS}
          placeholder="ステータスを選択してください。"
          defaultValue={ACTIVE_STATUS.ENABLE.toString()}
          disabled
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onClose}>
            <span className="font-semibold">{formText.cancel_button}</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]" loading={isPending}>
            <span className="font-semibold">{formText.delete_button}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<h1 className="text-lg font-semibold text-dark-gray-3">{formText.title}</h1>}
      className="rounded-3xl"
      footer={null}
      width={698}
      data={data}
    >
      <p className="px-12 text-lg font-light text-primary">{formText.description}</p>
      <p className="px-12 text-lg font-light text-primary">{formText.description2}</p>
      <div className="p-12 font-light">{renderForm}</div>
    </Modal>
  )
}

const UserDeleteCheckModalButton = ({ data, onSuccess }) => {
  const [open, onOpen, onClose] = useFlag()

  const { id: meId } = useAuth()

  return (
    <>
      <ButtonIcon icon={<TrashIcon />} onClick={onOpen} disabled={meId === data?.entra_id} />
      {open && <UserDeleteModalForm {...{ open, onClose, data, onSuccess }} />}
    </>
  )
}

export default UserDeleteCheckModalButton

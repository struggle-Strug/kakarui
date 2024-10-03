import { Form, Modal } from 'antd'

import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ACTIVE_STATUS_OPTIONS, USER_ROLE_OPTIONS } from '@/constants'
import { useFlag } from '@/hooks/share'

import { Checkbox, Input, Select } from '@/components/form'
import { TrashIcon } from '@/components/icons'
import { Button, ButtonIcon } from '@/components/ui'

const formText = {
  title: 'ユーザー削除',
  description: '下記のユーザを削除します。よろしいですか？',
  company_name_label: '会社名:',
  name_label: '氏名:',
  email_label: 'メールアドレス:',
  role_label: 'ロール:',
  status_label: 'ステータス:',
  sub_role_label: 'サブロール:',
  delete_button: ' 削除 ',
  reset_button: 'リセット',
}

const UserDeleteModalButton = () => {
  const [open, onOpen, onClose] = useFlag()

  const defaultValues = useMemo(() => ({}), [])

  const methods = useForm()

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data)
    onClose()
  }

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
      >
        <Input
          name="companyName"
          label={formText.company_name_label}
          placeholder="会社名を入力してください。"
        />

        <Input name="name" label={formText.name_label} placeholder="氏名を入力してください。" />

        <Input
          name="email"
          label={formText.email_label}
          placeholder="メールアドレスを入力してください。"
        />

        <Select
          name="role"
          label={formText.role_label}
          options={USER_ROLE_OPTIONS}
          placeholder="ロールを選択してください。"
        />

        <Checkbox name="sub_role" label={formText.sub_role_label} title="デプロイ管理者" />

        <Select
          name="status"
          label={formText.status_label}
          options={ACTIVE_STATUS_OPTIONS}
          placeholder="ステータスを選択してください。"
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold">{formText.delete_button}</span>
          </Button>
          <Button type="default" className="min-w-[200px]">
            <span className="font-semibold">{formText.reset_button}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return (
    <>
      <ButtonIcon icon={<TrashIcon />} onClick={onOpen} />
      <Modal
        open={open}
        onCancel={onClose}
        title={<h1 className="text-lg font-semibold text-dark-gray-3">{formText.title}</h1>}
        className="rounded-3xl"
        footer={null}
        width={698}
      >
        <p className="px-12 text-lg font-light text-primary">{formText.description}</p>
        <div className="p-12 font-light">{renderForm}</div>
      </Modal>
    </>
  )
}

export default UserDeleteModalButton

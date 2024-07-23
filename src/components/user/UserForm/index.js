import { yupResolver } from '@hookform/resolvers/yup'
import { Form } from 'antd'

import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ACTIVE_STATUS, ACTIVE_STATUS_OPTIONS, USER_ROLE, USER_ROLE_OPTIONS } from '@/constants'

import { Checkbox, Input, Select } from '@/components/form'
import { Button } from '@/components/ui'

import { FORM_INFO, userFormSchema, userValues } from '@/validations/userSchema'

const UserForm = ({ onAddEdit, isEdit, data, onClose, loading }) => {
  const defaultValues = useMemo(
    () =>
      isEdit
        ? {
            ...data,
            status: data?.enable
              ? ACTIVE_STATUS.ENABLE.toString()
              : ACTIVE_STATUS.DISABLE.toString(),
          }
        : userValues,
    [data, isEdit]
  )

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(userFormSchema()),
    defaultValues,
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = (values) => {
    onAddEdit(values)
  }

  return (
    <FormProvider {...methods}>
      <Form
        onFinish={methods.handleSubmit(onSubmit)}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 8 }}
        layout="horizontal"
        labelAlign="left"
        colon={false}
        labelWrap
      >
        <Input name={FORM_INFO.COMPANY} label="会社名:" placeholder="会社名を入力してください。" />

        <Input name={FORM_INFO.NAME} label="氏名:" placeholder="氏名を入力してください。" />

        <Input
          name={FORM_INFO.EMAIL}
          label="メールアドレス:"
          placeholder="メールアドレスを入力してください。"
        />

        <Select
          name={FORM_INFO.ROLE}
          label="ロール:"
          options={USER_ROLE_OPTIONS}
          placeholder="ロールを選択してください。"
          defaultValue={USER_ROLE.MEMBER}
        />

        <Checkbox name={FORM_INFO.SUB_ROLE} label="サブロール:" title="デプロイ管理者" />

        <Select
          name="status"
          label="ステータス:"
          options={ACTIVE_STATUS_OPTIONS}
          placeholder="ステータスを選択してください。"
          defaultValue={ACTIVE_STATUS.ENABLE.toString()}
          disabled={!isEdit}
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onClose}>
            <span className="font-semibold">{isEdit ? 'リセット' : 'キャンセル'}</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]" loading={loading}>
            <span className="font-semibold">{isEdit ? ' 変更 ' : ' 招待 '}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )
}

export default UserForm

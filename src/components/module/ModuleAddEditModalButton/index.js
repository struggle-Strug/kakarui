import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, message } from 'antd'

import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useFlag } from '@/hooks/share'
import moduleApiStub from '@/hooks/stub/module'

import { Input, InputTextArea, UploadImageInput } from '@/components/form'
import { AddIcon, EditIcon } from '@/components/icons'
import { Button, ButtonIcon } from '@/components/ui'

import { uuidv4 } from '@/utils/helper'

import { moduleFormSchema, moduleValues } from '@/validations/moduleSchema'

const ModuleForm = ({ onSuccess, isEdit, data, onClose }) => {
  const defaultValues = useMemo(() => (isEdit ? data : moduleValues), [data, isEdit])

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(moduleFormSchema()),
    defaultValues,
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const updateModule = async (values) => {
    const updateData = {
      ...values,
      update_date: new Date().toISOString(),
    }
    await moduleApiStub.updateModule(data.id, updateData)
    onSuccess?.()
    onClose()
  }

  const onSubmit = async (values) => {
    if (isEdit) {
      updateModule(values)
      return
    }
    const newModule = {
      id: uuidv4(),
      organization_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      repository_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      repository_name: 'repo name',
      create_user: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      create_date: new Date().toISOString(),
      update_user: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      update_date: new Date().toISOString(),
      latest_tag: values?.tag,
      ...values,
    }
    try {
      await moduleApiStub.addModule(newModule)
      onSuccess?.()
      onClose()
    } catch (error) {
      message.error(error?.message)
    }
  }

  return (
    <FormProvider {...methods}>
      <Form
        onFinish={methods.handleSubmit(onSubmit)}
        labelCol={{ flex: '164px' }}
        wrapperCol={{ flex: 1 }}
        layout="horizontal"
        labelAlign="left"
        colon={false}
        labelWrap
      >
        <Input name="name" label="モジュール名:" placeholder="モジュール名を入力してください。" />

        <UploadImageInput name="file" label="モジュール: " />

        <Input name="tag" label="タグ:" placeholder="タグを入力してください。" />

        <InputTextArea
          rows={4}
          label="説明:"
          name="description"
          placeholder="説明を入力してください。"
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onClose}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold"> 登録 </span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )
}

const ModuleAddEditModalButton = ({ label, isEdit, ...props }) => {
  const [open, onOpen, onClose] = useFlag()

  return (
    <>
      {isEdit ? (
        <ButtonIcon icon={<EditIcon size={32} />} onClick={onOpen} />
      ) : (
        <Button icon={<AddIcon size={36} />} type="outline" label={label} onClick={onOpen} />
      )}
      {open && (
        <Modal
          open={open}
          onCancel={onClose}
          title={<h1 className="text-lg font-semibold text-dark-gray-3">モジュール登録・変更</h1>}
          className="rounded-3xl"
          footer={null}
          width={698}
        >
          <p className="px-12 text-lg font-light text-primary">
            モジュールの情報を入力してください。
          </p>
          <div className="p-12 pr-20 font-light">
            <ModuleForm {...props} isEdit={isEdit} onClose={onClose} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModuleAddEditModalButton

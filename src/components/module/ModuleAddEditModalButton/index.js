import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin } from 'antd'

import { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useModuleCreate, useModuleUpdate } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { Input, InputTarFile, InputTextArea } from '@/components/form'
import { AddIcon, EditIcon } from '@/components/icons'
import { Button, ButtonIcon } from '@/components/ui'

import { FORM_INFO, moduleFormSchema } from '@/validations/moduleSchema'

const ModuleForm = ({ onSuccess, isEdit, data, onClose }) => {
  const defaultValues = useMemo(
    () => ({
      ...(data || {}),
      tag: data?.latest_tag || data?.tag?.[0]?.name || '',
      file: null,
    }),
    [data]
  )

  const { doCreateModule, isPending: createLoading } = useModuleCreate({
    onSuccess: () => {
      onClose()
      onSuccess?.()
    },
  })

  const { doUpdateModule, isPending: updateLoading } = useModuleUpdate({
    onSuccess: () => {
      onClose()
      onSuccess?.()
    },
  })

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(moduleFormSchema()),
    defaultValues,
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = useCallback(
    async (values) => {
      if (isEdit) {
        doUpdateModule(values)
        return
      }
      doCreateModule(values)
    },
    [doCreateModule, doUpdateModule]
  )

  const renderForm = (
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
        <Input
          name={FORM_INFO.NAME}
          label="モジュール名:"
          placeholder="モジュール名を入力してください。"
        />

        <InputTarFile name={FORM_INFO.FILE} label="モジュール: " />

        <Input name={FORM_INFO.TAG} label="タグ:" placeholder="タグを入力してください。" />

        <InputTextArea
          rows={4}
          label="説明:"
          name={FORM_INFO.DESCRIPTION}
          placeholder="説明を入力してください。"
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button
            type="default"
            className="min-w-[200px]"
            onClick={() => onClose()}
            disabled={createLoading || updateLoading}
          >
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="min-w-[200px]"
            disabled={createLoading || updateLoading}
          >
            <span className="font-semibold"> 登録 </span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return <Spin spinning={createLoading || updateLoading}>{renderForm}</Spin>
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
          onCancel={() => onClose()}
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

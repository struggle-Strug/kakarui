import { Form, Modal, Spin } from 'antd'

import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useModuleDelete, useModuleUsageCheck } from '@/hooks/query'

import { Input, InputTarFile, InputTextArea } from '@/components/form'
import { Button } from '@/components/ui'

import { FORM_INFO } from '@/validations/moduleSchema'

const initValue = {
  id: null,
  name: '',
  description: '',
  tag: '',
  file: null,
}

const ModuleDeleteForm = ({ open, data, onClose }) => {
  const { doDeleteModule, isPending: deleteLoading } = useModuleDelete({
    onSuccess: () => {
      onClose()
    },
  })

  const isUsed = useModuleUsageCheck({ moduleId: data?.id })

  const methods = useForm({
    mode: 'onChange',
    defaultValues: { ...initValue },
  })

  useEffect(() => {
    const defaultValue = data
      ? {
          id: data.id,
          name: data.name,
          description: data.description,
          tag: data.latest_tag,
          file: null,
        }
      : { ...initValue }
    methods.reset(defaultValue)
  }, [data])

  const onSubmit = useCallback(
    async (values) => {
      doDeleteModule(values)
    },
    [doDeleteModule]
  )

  return (
    <Modal
      open={open}
      onCancel={() => onClose()}
      title={<h1 className="text-lg font-semibold text-dark-gray-3">モジュール削除確認</h1>}
      className="rounded-3xl"
      footer={null}
      width={698}
    >
      <p className="px-12 text-lg font-light text-primary">
        以下のモジュールを削除します。よろしいですか？
      </p>
      {isUsed && (
        <p className="px-12 text-lg font-light text-primary">
          このモジュールは1つ以上のモジュール配置又はモジュールセットで使用されています。
        </p>
      )}
      <div className="p-12 pr-20 font-light">
        <Spin spinning={deleteLoading}>
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
              <Input name={FORM_INFO.NAME} label="モジュール名:" disabled />

              <InputTarFile name={FORM_INFO.FILE} label="モジュール: " disabled />

              <Input name={FORM_INFO.TAG} label="タグ:" disabled />

              <InputTextArea
                rows={4}
                label="説明:"
                name={FORM_INFO.DESCRIPTION}
                disabled
                placeholder=""
              />

              <div className="flex-end mt-12 gap-x-4">
                <Button
                  type="default"
                  className="min-w-[200px]"
                  onClick={() => onClose()}
                  disabled={deleteLoading}
                >
                  <span className="font-semibold">キャンセル</span>
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="min-w-[200px]"
                  disabled={deleteLoading}
                >
                  <span className="font-semibold">削除</span>
                </Button>
              </div>
            </Form>
          </FormProvider>
        </Spin>
      </div>
    </Modal>
  )
}

export default ModuleDeleteForm

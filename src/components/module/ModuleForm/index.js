import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin } from 'antd'

import { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useModuleCreate, useModuleUpdate } from '@/hooks/query'

import { Input, InputTarFile, InputTextArea } from '@/components/form'
import { Button } from '@/components/ui'

import { FORM_INFO, moduleFormSchema } from '@/validations/moduleSchema'

const ModuleForm = ({ open, data, onSuccess, onClose }) => {
  const isEdit = useMemo(() => {
    if (data) return true
    return false
  }, [data])

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(moduleFormSchema(isEdit)),
    defaultValues: {
      id: null,
      name: '',
      description: '',
      tag: '',
      file: null,
    },
  })

  useEffect(() => {
    if (data) {
      methods.reset({
        id: data.id,
        name: data.name,
        description: data.description,
        tag: data.latest_tag,
        file: null,
      })
    }
  }, [data])

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

  const onSubmit = useCallback(
    async (values) => {
      if (data) {
        doUpdateModule(values)
        return
      }
      doCreateModule(values)
    },
    [doCreateModule, doUpdateModule]
  )

  return (
    <Modal
      open={open}
      onCancel={() => onClose()}
      title={<h1 className="text-lg font-semibold text-dark-gray-3">モジュール登録・変更</h1>}
      className="rounded-3xl"
      footer={null}
      width={698}
    >
      <p className="px-12 text-lg font-light text-primary">モジュールの情報を入力してください。</p>
      <div className="p-12 pr-20 font-light">
        <Spin spinning={createLoading || updateLoading}>
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
                  <span className="font-semibold">{isEdit ? '保存' : '登録'}</span>
                </Button>
              </div>
            </Form>
          </FormProvider>
        </Spin>
      </div>
    </Modal>
  )
}

export default ModuleForm

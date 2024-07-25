import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Space } from 'antd'

import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Routes } from '@/constants'

import { Input, InputTextArea } from '@/components/form'
import { AddIcon } from '@/components/icons'
import { ModuleAddEditModalButton } from '@/components/module'
import { ModuleSelectionModal } from '@/components/module_selection'
import { Button } from '@/components/ui'

import { placeHolderData } from '@/services/placeholder-data'
import { FORM_MODULE_SET, moduleSetSchema } from '@/validations/moduleSetSchema'

import ModuleSetAddTableForm from '../ModuleSetAddTableForm'

const ModuleSetForm = ({ isEdit, onAddUpdate, data }) => {
  const router = useRouter()

  const [moduleSetId, setModuleSetId] = useState(null)

  const defaultValues = useMemo(() => (isEdit ? { ...(data || {}) } : {}), [data])

  const methods = useForm({
    resolver: yupResolver(moduleSetSchema()),
    defaultValues,
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = (values) => {
    // eslint-disable-next-line no-console
    console.log(values)
    onAddUpdate(values)
  }

  const onBack = () => {
    router.replace(Routes.MODULE_SET)
  }

  const renderForm = (
    <FormProvider {...methods}>
      <Form
        onFinish={methods.handleSubmit(onSubmit)}
        labelCol={{ flex: '220px' }}
        wrapperCol={{ flex: 1 }}
        layout="horizontal"
        labelAlign="left"
        colon={false}
        labelWrap
      >
        <div className="w-[910px]">
          <Input
            label="モジュールセット名:"
            name={FORM_MODULE_SET.NAME}
            placeholder="モジュールセット名を入力してください。"
          />
          <InputTextArea
            label="説明:"
            name={FORM_MODULE_SET.DESCRIPTION}
            placeholder="説明を入力してください。"
            rows={4}
          />
        </div>

        <Space className="mb-6 flex justify-end">
          <Button
            type="outline"
            label="モジュールを選択追加"
            icon={<AddIcon size={36} />}
            onClick={() => setModuleSetId('abc')}
          />
          <ModuleAddEditModalButton label="新規モジュール追加" />
        </Space>

        <ModuleSetAddTableForm
          data={data?.moduleset_modules || placeHolderData.module_set_detail.moduleset_modules}
        />

        {isEdit && (
          <Space className="flex-end mt-12 gap-x-4">
            <Button type="default" className="min-w-[200px]" onClick={onBack}>
              <span className="font-semibold">キャンセル</span>
            </Button>
            <Button type="primary" htmlType="submit" className="min-w-[200px]">
              <span className="font-semibold">保存</span>
            </Button>
          </Space>
        )}
        {!isEdit && (
          <Space className="flex-end mt-12 gap-x-4">
            <Button type="primary" htmlType="submit" className="min-w-[200px]">
              <span className="font-semibold">登録</span>
            </Button>
            <Button type="default" className="min-w-[200px]" onClick={onBack}>
              <span className="font-semibold">キャンセル</span>
            </Button>
          </Space>
        )}
      </Form>
    </FormProvider>
  )

  return (
    <>
      {renderForm}
      <ModuleSelectionModal open={!!moduleSetId} onClose={() => setModuleSetId(null)} />
    </>
  )
}

export default ModuleSetForm

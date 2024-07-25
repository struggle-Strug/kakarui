import { yupResolver } from '@hookform/resolvers/yup'
import { Form } from 'antd'

import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { DEPLOYMENT_MODEL_OPTIONS, DEPLOYMENT_TYPE_OPTIONS } from '@/constants'
import { useProjectActive } from '@/hooks/query'
import moduleConfigApiStub from '@/hooks/stub/module_config'

import { Input, InputTextArea, Select } from '@/components/form'
import { Button } from '@/components/ui'

import { FORM_INFO, deployFormSchema, deployValues } from '@/validations/deploySchema'

const DeploymentForm = ({ onAddEdit, isEdit, data, onClose }) => {
  const { projectActiveId } = useProjectActive()

  const defaultValues = useMemo(
    () =>
      isEdit
        ? {
            ...data,
          }
        : deployValues,
    [data, isEdit]
  )

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(deployFormSchema()),
    defaultValues,
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = (values) => {
    onAddEdit(values)
  }

  const moduleConfigs = moduleConfigApiStub.getRawData()

  const moduleOptions = moduleConfigs.flatMap((m) => {
    if (m?.project_id !== projectActiveId) return []
    return { label: m?.name, value: m?.id }
  })

  const onChangeModule = (value) => {
    methods.setValue(FORM_INFO.DESCRIPTION, moduleConfigs.find((i) => i?.id === value)?.description)
  }

  const renderForm = (
    <FormProvider {...methods}>
      <Form
        onFinish={methods.handleSubmit(onSubmit)}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        labelAlign="left"
        colon={false}
        labelWrap
        className="item-start"
      >
        <Input
          name={FORM_INFO.PROJECT_NAME}
          label="プロジェクト名:"
          placeholder="プロジェクト名を入力してください。"
          disabled
        />

        <Select
          name={FORM_INFO.MODULE}
          label="モジュール配置名:"
          placeholder="モジュール配置名を選択してください。"
          onChangeInput={onChangeModule}
          options={moduleOptions}
        />

        <InputTextArea
          label="説明:"
          name={FORM_INFO.DESCRIPTION}
          placeholder="説明を入力してください。"
          rows={3}
          disabled
        />

        <Select
          name={FORM_INFO.TYPE}
          label="デプロイ先タイプ:"
          options={DEPLOYMENT_TYPE_OPTIONS}
          placeholder="デプロイ先タイプを選択してください。"
        />

        <Select
          name={FORM_INFO.MODEL}
          label="デプロイ先モデル:"
          options={DEPLOYMENT_MODEL_OPTIONS}
          placeholder="デプロイ先モデルを入力してください。"
          disabled
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px] text-primary" onClick={onClose}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold">{isEdit ? 'デプロイ' : 'デプロイ'}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return <>{renderForm}</>
}

export default DeploymentForm

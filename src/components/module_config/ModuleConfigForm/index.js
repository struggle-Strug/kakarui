import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Space } from 'antd'

import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Routes } from '@/constants'

import { Input, InputTextArea } from '@/components/form'
import { AddIcon, ExternalLinkIcon } from '@/components/icons'
import ModuleAddEditModalButton from '@/components/module/ModuleAddEditModalButton'
import { ModuleSelectionModal, ModuleSetSelectionModal } from '@/components/module_selection'
import { Button } from '@/components/ui'

import { placeHolderData } from '@/services/placeholder-data'
import { FORM_MODULE_CONFIG, moduleConfigSchema } from '@/validations/moduleConfigSchema'

import ModuleConfigAddTableForm from '../ModuleConfigAddTableForm'

const ModuleConfigForm = ({ isEdit, onAddUpdate, data }) => {
  const router = useRouter()

  const [moduleSelectionId, setModuleSelectionId] = useState(null)
  const [selectedModuleSet, setSelectedModuleSet] = useState(null)
  const [showModuleSetSelectionModal, setShowModuleSetSelectionModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState([])

  const defaultValues = useMemo(() => (isEdit ? { ...(data || {}) } : {}), [data])

  const methods = useForm({
    resolver: yupResolver(moduleConfigSchema()),
    defaultValues,
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = (values) => {
    onAddUpdate(values, selectedModule)
  }

  const onBack = () => {
    router.replace(Routes.MODULE_CONFIG)
  }

  const closeModuleSetSelectionModal = (value = null) => {
    if (value) setSelectedModuleSet(value)
    setShowModuleSetSelectionModal(false)
  }

  // eslint-disable-next-line no-console
  console.log('selectedModuleSet', selectedModuleSet)

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
            label="モジュール配置名:"
            name={FORM_MODULE_CONFIG.NAME}
            placeholder="モジュール配置名を入力してください。"
          />

          <InputTextArea
            label="説明:"
            name={FORM_MODULE_CONFIG.DESCRIPTION}
            placeholder="説明を入力してください。"
            rows={4}
          />
        </div>

        <Space className="mb-6 flex justify-end">
          <Button
            type="outline"
            label="モジュールセット選択"
            icon={<ExternalLinkIcon size={46} />}
            onClick={() => setShowModuleSetSelectionModal(true)}
          />
          <Button
            type="outline"
            label="モジュールを選択追加"
            icon={<AddIcon size={36} />}
            onClick={() => setModuleSelectionId('abc')}
          />
          <ModuleAddEditModalButton label="モジュールを追加" />
        </Space>

        <ModuleConfigAddTableForm
          data={
            data?.config_data?.modules || placeHolderData.module_config_detail.config_data.modules
          }
          setSelectedModule={setSelectedModule}
        />

        <Space className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onBack}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold"> {isEdit ? '保存' : '登録'} </span>
          </Button>
        </Space>
      </Form>
    </FormProvider>
  )

  return (
    <>
      {renderForm}
      <ModuleSelectionModal
        open={!!moduleSelectionId}
        moduleSelectionId={moduleSelectionId}
        onClose={() => setModuleSelectionId(null)}
      />
      <ModuleSetSelectionModal
        open={showModuleSetSelectionModal}
        onClose={(value) => closeModuleSetSelectionModal(value)}
      />
    </>
  )
}

export default ModuleConfigForm

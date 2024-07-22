import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin } from 'antd'
import get from 'lodash/get'

import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  DEPLOYMENT_MODEL_OPTIONS,
  DEPLOYMENT_MODEL_TYPE,
  DEPLOYMENT_TYPE_OPTIONS,
  Routes,
} from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import { useModuleConfigList } from '@/hooks/query'
import { useFlag, useLocalStorage } from '@/hooks/share'
import deployApiStub from '@/hooks/stub/deploy'
import projectApiStub from '@/hooks/stub/project'

import { Input, InputTextArea, Select } from '@/components/form'
import { Button } from '@/components/ui'

import { uuidv4 } from '@/utils/helper'

import { FORM_INFO, deployFormSchema, deployValues } from '@/validations/deploySchema'

const DeployAddEditModal = ({ children, isEdit, data, onSuccess = () => {} }) => {
  const router = useRouter()
  const [open, onOpen, onClose] = useFlag()
  const { data: moduleList = [] } = useModuleConfigList()

  const [project, setProject] = useLocalStorage('defaultProject')

  const refreshProject = () => {
    projectApiStub.getDefaultProject().then(setProject)
  }

  useEffect(() => {
    refreshProject()
  }, [])

  const [loading, startLoading] = useLoadingSimulation()

  const defaultValues = useMemo(() => {
    if (isEdit) {
      if (data) {
        // eslint-disable-next-line @next/next/no-assign-module-variable
        const module = get(data, ['config_data', 'modules', 0].join('.'))

        return {
          ...data,
          [FORM_INFO.PROJECT_NAME]: project?.name || 'プロト1.5',
          [FORM_INFO.MODULE]: data?.id,
          [`${FORM_INFO.MODULE}_name`]: data?.name,
          type: module?.type || 'sim',
          model: module?.model || DEPLOYMENT_MODEL_TYPE.NYOKKEY,
        }
      }

      return data
    }
    return {
      ...deployValues,
      [FORM_INFO.PROJECT_NAME]: project?.name || 'プロト1.5',
    }
  }, [data, project, isEdit])

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(deployFormSchema()),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      methods.reset({})
    }
  }, [open])

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = (values) => {
    // eslint-disable-next-line no-console
    console.log(values)

    try {
      if (!isEdit) {
        const newData = {
          id: uuidv4(),
          update_date: new Date().toISOString(),
          create_date: new Date().toISOString(),
          ...values,

          module_config_name: moduleList?.find((item) => item?.id === values?.module)?.name,
          status: 'In Progress',
          execute_result_url: 'https://hoge.blob.core.windows.net/huga/hogehuga.mp4',
        }
        deployApiStub.startDeploy(newData, data)
        router.push(Routes.DEPLOY)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('error', e)
    } finally {
      startLoading(() => {
        onSuccess?.()
        onClose()
      })
    }
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
          disabled
          placeholder="プロジェクト名を入力してください。"
        />

        <Select
          name={FORM_INFO.MODULE}
          label="モジュール配置名:"
          options={moduleList.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          placeholder="ジュール配置名を入力してください。"
        />

        <InputTextArea
          name={FORM_INFO.DESCRIPTION}
          label="説明:"
          rows={3}
          disabled
          placeholder="説明を入力してください。"
        />

        <Select
          name={FORM_INFO.TYPE}
          label="デプロイ先タイプ:"
          options={DEPLOYMENT_TYPE_OPTIONS}
          placeholder="デプロイ先タイプを入力してください。"
        />

        <Select
          name={FORM_INFO.MODEL}
          label="デプロイ先モデル:"
          options={DEPLOYMENT_MODEL_OPTIONS}
          disabled
          placeholder="デプロイ先モデルを入力してください。"
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

  return (
    <>
      <div role="presentation" onClick={onOpen}>
        {children}
      </div>
      <Modal
        open={open}
        onCancel={onClose}
        title={
          <h1 className="text-lg font-semibold text-dark-gray-3">
            {isEdit ? 'デプロイ' : 'デプロイ'}
          </h1>
        }
        className="rounded-3xl"
        footer={null}
        width={698}
      >
        <p className="px-12 text-lg font-light text-primary">デプロイを実行します。</p>
        <Spin spinning={loading}>
          <div className="p-12 font-light">{renderForm}</div>
        </Spin>
      </Modal>
    </>
  )
}

export default DeployAddEditModal

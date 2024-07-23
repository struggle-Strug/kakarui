import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin } from 'antd'
import get from 'lodash/get'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { cloneElement, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  DEPLOYMENT_MODEL_OPTIONS,
  DEPLOYMENT_MODEL_TYPE,
  DEPLOYMENT_TYPE_OPTIONS,
  Routes,
  USER_ROLE,
  httpStatusCode,
} from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import { useLocalStorageDefaultProject } from '@/hooks/custom/useLocalStorageSync'
import { useAuth, useGetMe } from '@/hooks/query'
import { useFlag } from '@/hooks/share'
import deployApiStub from '@/hooks/stub/deploy'
import moduleConfigApiStub from '@/hooks/stub/module_config'

import { Input, InputTextArea, Select } from '@/components/form'
import { Button } from '@/components/ui'

import { uuidv4 } from '@/utils/helper'

import { FORM_INFO, deployFormSchema, deployValues } from '@/validations/deploySchema'

const DeployAddEditModal = ({ children, isEdit, data, dataList, onSuccess = () => {} }) => {
  useAuth()
  const { data: me, isLoading, isError, isFetched, isSuccess, error } = useGetMe()
  const isDeployAdmin =
    me?.user?.organizations?.some(
      (organization) => organization?.sub_role === USER_ROLE.DEPLOY_ADMIN
    ) || false
  const router = useRouter()
  const [open, onOpen, onClose] = useFlag()
  const [project, , { projectName }] = useLocalStorageDefaultProject()
  const [moduleList, setModuleConfigs] = useState([])
  useEffect(() => {
    if (!isDeployAdmin && !isLoading && !isError && isFetched && isSuccess && me && open) {
      onClose()
      router.back()
    }
  }, [isDeployAdmin, isLoading, isError, me, isFetched, isSuccess, open])

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  useEffect(() => {
    if (dataList) {
      setModuleConfigs(dataList)
    } else {
      moduleConfigApiStub.getModuleConfig(filter, sort, search, project).then(setModuleConfigs)
    }
  }, [filter, sort, search, project, dataList])

  const [loading, startLoading] = useLoadingSimulation()

  const defaultValues = useMemo(() => {
    if (isEdit) {
      if (data) {
        // eslint-disable-next-line @next/next/no-assign-module-variable
        const module = get(data, ['config_data', 'modules', 0].join('.'))

        return {
          ...data,
          [FORM_INFO.PROJECT_NAME]: projectName || 'プロト1.5',
          [FORM_INFO.MODULE]: data?.id,
          [`${FORM_INFO.MODULE}_name`]: data?.name,
          type: data?.type || module?.type || 'sim',
          model: data?.model || module?.model || DEPLOYMENT_MODEL_TYPE.NYOKKEY,
        }
      }

      return data
    }
    return {
      ...deployValues,
      [FORM_INFO.PROJECT_NAME]: projectName || 'プロト1.5',
    }
  }, [data, project, projectName, isEdit])

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
  }, [defaultValues, project, projectName])

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
          module_config_id: values?.module,
          status: 'In Progress',
        }
        deployApiStub.startDeploy(newData)
        router.push(Routes.DEPLOY)
      } else {
        const newData = {
          update_date: new Date().toISOString(),
          create_date: new Date().toISOString(),
          ...data,
          ...values,
          module_config_name: moduleList?.find((item) => item?.id === values?.module)?.name,
          module_config_id: values?.module,
        }
        deployApiStub.updateDeploy(newData, dataList)
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

  const moduleOptions = moduleList.map((item) => ({
    value: item.id,
    label: item.name,
  }))

  const onChangeModule = (value) => {
    methods.setValue(FORM_INFO.DESCRIPTION, moduleList?.find((i) => i?.id === value)?.description)
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
          placeholder="ジュール配置名を入力してください。"
          onChangeInput={onChangeModule}
          options={moduleOptions}
        />

        <InputTextArea
          name={FORM_INFO.DESCRIPTION}
          label="説明:"
          placeholder="説明を入力してください。"
          rows={3}
          disabled
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
          placeholder="デプロイ先モデルを入力してください。"
          disabled
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px] text-primary" onClick={onClose}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="min-w-[200px]"
            disabled={!isDeployAdmin}
            loading={
              isLoading ||
              isError ||
              error?.response?.status === httpStatusCode.INTERNAL_SERVER_ERROR
            }
          >
            <span className="font-semibold">{isEdit ? 'デプロイ' : 'デプロイ'}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return (
    <>
      {open && (
        <Head>
          <title>{isEdit ? 'デプロイ' : 'デプロイ'}</title>
        </Head>
      )}

      <div role="presentation" onClick={onOpen}>
        {cloneElement(children, {
          ...children.props,
          disabled: !isDeployAdmin,
          loading:
            isLoading ||
            isError ||
            error?.response?.status === httpStatusCode.INTERNAL_SERVER_ERROR,
        })}
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
        width={768}
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

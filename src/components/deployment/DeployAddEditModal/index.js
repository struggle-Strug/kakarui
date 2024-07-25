import { yupResolver } from '@hookform/resolvers/yup'
import { Modal, Spin } from 'antd'
import get from 'lodash/get'

import { cloneElement, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { DEPLOYMENT_MODEL_TYPE } from '@/constants'
import { useLoadingSimulation } from '@/hooks/custom'
import { useGetMe, useProjectActive } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { HeadNext } from '@/components/common'

import { FORM_INFO, deployFormSchema, deployValues } from '@/validations/deploySchema'

import DeploymentForm from './DeploymentForm'

const DeployAddEditModal = ({ children, isEdit, data }) => {
  const [open, onOpen, onClose] = useFlag()
  const { isAcceptedDeployment } = useGetMe()
  const { projectActive } = useProjectActive()

  const [loading, startLoading] = useLoadingSimulation()

  const defaultValues = useMemo(() => {
    if (isEdit) {
      if (data) {
        // eslint-disable-next-line @next/next/no-assign-module-variable
        const module = get(data, ['config_data', 'modules', 0].join('.'))

        return {
          ...data,
          [FORM_INFO.PROJECT_NAME]: projectActive?.name || 'プロト1.5',
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
      [FORM_INFO.PROJECT_NAME]: projectActive?.name || 'プロト1.5',
    }
  }, [data, isEdit, projectActive?.name])

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(deployFormSchema()),
    defaultValues,
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  // TODO: handle
  const onAddEdit = (values) => {
    // eslint-disable-next-line no-console
    console.log(values)

    startLoading(() => {
      methods.reset({})
      onClose()
    })
  }

  const title = isEdit ? 'デプロイ' : 'デプロイ'

  return (
    <>
      <div role="presentation" onClick={onOpen}>
        {cloneElement(children, {
          ...children.props,
          disabled: !isAcceptedDeployment,
        })}
      </div>

      {open ? (
        <Modal
          open={open}
          onCancel={onClose}
          title={<h1 className="text-lg font-semibold text-dark-gray-3">{title}</h1>}
          afterClose={() => methods.reset({})}
          className="rounded-3xl"
          footer={null}
          width={768}
        >
          <HeadNext title={title} />
          <p className="px-12 text-lg font-light text-primary">デプロイを実行します。</p>
          <Spin spinning={loading}>
            <div className="p-12 font-light">
              <DeploymentForm isEdit={isEdit} data={data} onAddEdit={onAddEdit} onClose={onClose} />
            </div>
          </Spin>
        </Modal>
      ) : null}
    </>
  )
}

export default DeployAddEditModal

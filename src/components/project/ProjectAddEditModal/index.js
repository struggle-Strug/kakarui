import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, message } from 'antd'
import noop from 'lodash/noop'

import { cloneElement, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useGetMe, useProjectCreate, useProjectUpdate } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { HeadNext } from '@/components/common'
import { Input, InputTextArea } from '@/components/form'
import { Button } from '@/components/ui'

import { FORM_INFO, projectFormSchema, projectValues } from '@/validations/projectSchema'

const ProjectForm = ({ isEdit, data, onSuccess, onClose }) => {
  const defaultValues = useMemo(() => (isEdit ? data : projectValues), [data, isEdit])
  const { doCreateProject, isPending: createLoading } = useProjectCreate({
    onSuccess: () => {
      onClose()
      onSuccess?.()
    },
    message,
  })
  const { doUpdateProject, isPending: updateLoading } = useProjectUpdate({
    onSuccess: () => {
      onClose()
    },
    message,
  })

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(projectFormSchema()),
    defaultValues,
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = async (values) => {
    if (isEdit) {
      const { name, description, id } = values
      doUpdateProject({ name, description, id })
      return
    }
    doCreateProject(values)
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
      >
        <Input
          name={FORM_INFO.PROJECT_NAME}
          label="プロジェクト名:"
          placeholder="プロジェクト名を入力してください。"
        />

        <InputTextArea
          name={FORM_INFO.DESCRIPTION}
          label="プロジェクト説明:"
          placeholder="プロジェクト説明を入力してください。"
          rows={5}
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onClose}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold">{isEdit ? ' 設定 ' : ' 作成 '}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return <Spin spinning={!!createLoading || !!updateLoading}>{renderForm}</Spin>
}

const ProjectAddEditModal = ({ children, isEdit, data, onSuccess }) => {
  const [open, onOpen, onClose] = useFlag()

  const { isAcceptedAddEditProject } = useGetMe()

  const title = isEdit ? 'プロジェクト設定' : 'プロジェクト作成'
  const description = isEdit
    ? 'プロジェクトの基本情報を設定してください。'
    : 'プロジェクトの基本情報を入力してください。'

  return (
    <>
      <div role="presentation" onClick={isAcceptedAddEditProject ? onOpen : noop}>
        {cloneElement(children, {
          ...children.props,
          disabled: !isAcceptedAddEditProject,
        })}
      </div>

      {open && (
        <Modal
          open={open}
          onCancel={onClose}
          title={<h1 className="text-lg font-semibold text-dark-gray-3">{title}</h1>}
          className="rounded-3xl"
          footer={null}
          width={698}
        >
          <HeadNext title={title} />
          <p className="px-12 text-lg font-light text-primary">{description}</p>
          <div className="p-12 font-light">
            <ProjectForm isEdit={isEdit} data={data} onClose={onClose} onSuccess={onSuccess} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default ProjectAddEditModal

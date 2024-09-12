import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, message } from 'antd'
import noop from 'lodash/noop'

import { cloneElement, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useGetMe, useProjectDelete } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { Input, InputTextArea } from '@/components/form'
import { TrashIcon } from '@/components/icons'
import { Button, ButtonIcon } from '@/components/ui'

import { FORM_INFO, projectFormSchema, projectValues } from '@/validations/projectSchema'

const formText = {
  title: 'プロジェクト削除確認',
  description: '以下のプロジェクトを削除します',
  description2: 'プロジェクトに紐付くモジュール配置及びデプロイの履歴はすべて削除されます。',
  project_name: 'プロジェクト名:',
  project_description: 'プロジェクト説明:',
  cancel_button: 'キャンセル',
  delete_button: ' 削除 ',
}

const ProjectForm = ({ data, onSuccess, onClose}) => {
  const defaultValues = useMemo(() => (data))
  
  const { doDeleteProject, isPending: deleteLoading } = useProjectDelete({
    onSuccess: () => {
      message.success('プロジェクトを削除しました。')
      onClose()
      onSuccess?.()
    },
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
    doDeleteProject(values)
  }

  const renderForm = (
    <FormProvider {...methods}>
      <Form
        onFinish={methods.handleSubmit(onSubmit)}
        labelCol={{ flex: '172px' }}
        wrapperCol={{ flex: 1 }}
        layout="horizontal"
        labelAlign="left"
        colon={false}
        labelWrap
      >
        <Input
          name={FORM_INFO.PROJECT_NAME}
          label={formText.project_name}
          disabled
        />

        <InputTextArea
          name={FORM_INFO.DESCRIPTION}
          label={formText.project_description}
          rows={5}
          disabled
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onClose}>
            <span className="font-semibold">{formText.cancel_button}</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold">{formText.delete_button}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return <Spin spinning={!!deleteLoading}>{renderForm}</Spin>
}

const ProjectDeleteModal = ({ children, data, onSuccess }) => {
  const [open, onOpen, onClose] = useFlag()

  const { isAcceptedAddEditProject } = useGetMe()

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
          title={<h1 className="text-lg font-semibold text-dark-gray-3">{formText.title}</h1>}
          className="rounded-3xl"
          footer={null}
          width={698}
        >
          <p className="px-12 text-lg font-light text-primary">{formText.description}</p>
          <p className="px-12 text-lg font-light text-primary">{formText.description2}</p>
          <div className="p-12 font-light">
            <ProjectForm data={data} onClose={onClose} onSuccess={onSuccess} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default ProjectDeleteModal
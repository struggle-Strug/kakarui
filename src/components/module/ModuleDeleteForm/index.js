import { Form, Modal, Radio, Spin } from 'antd'

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
  architectures: {},
}

const ModuleDeleteForm = ({ open, data, onClose, initialValue, setInitialValue, onRefetch, singleFileList, setSingleFileList, arm64FileList, setArm64FileList, amd64FileList, setAmd64FileList }) => {
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
      onRefetch()
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

              <Radio.Group className='flex justify-center gap-8 w-full pl-36' defaultValue={initialValue} disabled>
                <Radio value="single" autoFocus={true} className='text-sm' onChange={() => setInitialValue("single")}>シングルアーキテクチャ</Radio>
                <Radio value="multi" onChange={() => setInitialValue("multi")}>マルチアーキテクチャ</Radio>
              </Radio.Group> 

              <div className='module flex w-full' disabled>
                <div className='flex pt-4 w-[50%]' disabled={initialValue == "multi" && true}>
                 <InputTarFile name={FORM_INFO.SINGLEFILE} label="モジュール: " disabledfileList={singleFileList} setFileList={setSingleFileList}/>
                </div>
                <div className='flex justify-center gap-4 items-center w-[50%] pl-36' disabled>
                  <div className='flex flex-col items-center pt-4 rounded-md w-[7rem]'>
                    <InputTarFile name={FORM_INFO.ARM64FILE} disabled={initialValue == "single" && true} fileList={arm64FileList} setFileList={setArm64FileList}/>
                    <p className='pr-14'>Arm64</p>
                  </div>
                  <div className='flex flex-col items-center pt-4 rounded-md w-[7rem]'>
                    <InputTarFile name={FORM_INFO.AMD64FILE} disabled={initialValue == "single" && true} fileList={amd64FileList} setFileList={setAmd64FileList}/>
                    <p className='pr-14'>Amd64</p>
                  </div>
                </div>
              </div>

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

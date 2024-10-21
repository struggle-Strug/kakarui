import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, Radio } from 'antd'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useModuleCreate, useModuleUpdate, useModuleUpdateUrl, useModuleUrlCreate } from '@/hooks/query'

import { Input, InputTarFile, InputTextArea } from '@/components/form'
import { Button } from '@/components/ui'

import { FORM_INFO, moduleFormSchema } from '@/validations/moduleSchema'

const initValue = {
  id: null,
  name: '',
  description: '',
  tag: '',
  architectures: {},
}

const ModuleForm = ({ open, data, onClose }) => {
  const isEdit = useMemo(() => {
    if (data) return true
    return false
  }, [data])
  const [initialValue, setInitialValue] = useState("single");

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(moduleFormSchema(isEdit, initialValue)),
    defaultValues: { ...initValue },
  })
  
  useEffect(() => {
    const defaultValue = data
      ? {
          id: data.id,
          name: data.name,
          description: data.description,
          tag: data.latest_tag,
          architectures: {},
        }
      : { ...initValue }
    methods.reset(defaultValue)
  }, [data])

  const { doCreateModuleUrl, isPending: createUrlLoading } = useModuleUrlCreate({
    onSuccess: (module) => {
      onClose(module)
    },
  })

  const { doCreateModule, isPending: createLoading } = useModuleCreate({
    onSuccess: (module) => {
      onClose(module)
    },
  })

  const { doUpdateModuleUrl, isPending: updateUrlLoading } = useModuleUpdateUrl({
    onSuccess: (module) => {
      onClose(module)
    },
  })

  const { doUpdateModule, isPending: updateLoading } = useModuleUpdate({
    onSuccess: () => {
      onClose()
    },
  })

  const onSubmit = useCallback(
    async (values) => {
      
      if (isEdit) {
        const sasUrlDetail = await doUpdateModuleUrl(values)
        doUpdateModule(values, sasUrlDetail)
        return
      }
      const sasUrlDetail = await doCreateModuleUrl(values)
      const detail = sasUrlDetail?.data
      console.log("detail",detail);
      sasUrlDetail && doCreateModule({values, detail})
    },
    [doCreateModuleUrl, doCreateModule, doUpdateModule, isEdit]
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
        <Spin spinning={createUrlLoading || createLoading || updateUrlLoading || updateLoading}>
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

              <Radio.Group className='flex justify-center gap-8 w-full pl-36' defaultValue={initialValue} >
                <Radio value={"single"} autoFocus={true} className='text-sm' onChange={() => setInitialValue("single")}>シングルアーキテクチャ</Radio>
                <Radio value={"multi"} onChange={() => setInitialValue("multi")}>マルチアーキテクチャ</Radio>
              </Radio.Group> 

              <div className='module flex w-full' >
                <div className='flex pt-4 w-[50%]' disabled={initialValue == "multi" && true}>
                 <InputTarFile name={FORM_INFO.SINGLEFILE} label="モジュール: " disabled={initialValue == "multi" && true}/>
                </div>
                <div className='flex justify-center gap-4 items-center w-[50%] pl-36' disabled={initialValue == "single" && true}>
                  <div className='flex flex-col items-center pt-4 rounded-md w-[7rem]'>
                    <InputTarFile name={FORM_INFO.ARM64FILE} disabled={initialValue == "single" && true}/>
                    <p className='pr-14'>Arm64</p>
                  </div>
                  <div className='flex flex-col items-center pt-4 rounded-md w-[7rem]'>
                    <InputTarFile name={FORM_INFO.AMD64FILE} disabled={initialValue == "single" && true}/>
                    <p className='pr-14'>Amd64</p>
                  </div>
                </div>
              </div>

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

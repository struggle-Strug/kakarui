import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Space } from 'antd'
import orderBy from 'lodash/orderBy'

import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import { DEPLOYMENT_TYPE_OPTIONS, Routes } from '@/constants'

import { Input, InputTextArea, Select } from '@/components/form'
import { AddIcon, ExternalLinkIcon, TrashIcon } from '@/components/icons'
import { ModuleForm, ModuleSettingModal } from '@/components/module'
import { ModuleSelectionModal, ModuleSetSelectionModal } from '@/components/module_selection'
import { Button, ButtonIcon, Table } from '@/components/ui'

import { FORM_MODULE_CONFIG, moduleConfigSchema } from '@/validations/moduleConfigSchema'

const ModuleConfigForm = ({ isEdit, onSubmit, data }) => {
  const router = useRouter()

  const [tableKey, setTableKey] = useState(0)
  const [moduleSelectionModalFlag, setModuleSelectionModalFlag] = useState(false)
  const [moduleSelectionModalType, setModuleSelectionModalType] = useState('checkbox')
  const [moduleSelectionModalChangeIndex, setModuleSelectionModalChangeIndex] = useState(null)
  const [moduleSetSelectionModalFlag, setModuleSetSelectionModalFlag] = useState(false)
  const [moduleFormFlag, setModuleFormFlag] = useState(false)
  const [moduleSettingModalIndex, setModuleSettingModalIndex] = useState(-1)
  const [moduleSettingModalFlag, setModuleSettingModalFlag] = useState(false)
  const [moduleSettingModalData, setModuleSettingModalData] = useState(null)

  const methods = useForm({
    resolver: yupResolver(moduleConfigSchema),
    defaultValues: {
      name: '',
      description: '',
      config_data: {
        modules: [],
      },
    },
  })

  useEffect(() => {
    if (data) {
      const defaultValues = {
        ...data,
        config_data: {
          modules: data.config_data.modules.map((module, i) => {
            return {
              ...module,
              key: `${Date.now()}-${i}`,
            }
          }),
        },
      }
      methods.reset(defaultValues)
    }
  }, [data])

  const { append, remove } = useFieldArray({
    control: methods.control,
    name: 'config_data.modules',
  })

  const values = methods.getValues()

  const moduleCheckSelectionModalOpen = useCallback(() => {
    setModuleSelectionModalType('checkbox')
    setModuleSelectionModalFlag(true)
  }, [setModuleSelectionModalType, setModuleSelectionModalFlag])

  const moduleRadioSelectionModalOpen = useCallback(
    (index) => {
      setModuleSelectionModalChangeIndex(index)
      setModuleSelectionModalType('radio')
      setModuleSelectionModalFlag(true)
    },
    [setModuleSelectionModalChangeIndex, setModuleSelectionModalType, setModuleSelectionModalFlag]
  )

  const moduleCheckSelectionModalClose = useCallback(
    (newModules = null) => {
      if (newModules) {
        if (moduleSelectionModalType === 'checkbox') {
          const newSelectionModules = newModules
            .map((module, i) =>
              module.tags.map((tag, j) => {
                return {
                  key: `${Date.now()}-${i}-${j}`,
                  module_id: module.id,
                  module_set_id: null,
                  module_name: module.name,
                  tag: tag.name,
                  type: '',
                  config_data: {},
                }
              })
            )
            .flat()
          append(newSelectionModules)
          setTableKey((prevKey) => prevKey + 1)
        }
        if (moduleSelectionModalType === 'radio') {
          const newModule = newModules[0]
          const oldModule = values.moduleset_modules[moduleSelectionModalChangeIndex]
          if (newModule && oldModule) {
            const changeModule = {
              key: `${Date.now()}`,
              module_id: newModule.id,
              module_set_id: null,
              module_name: newModule.name,
              tag: newModule.tags[0].name,
              type: oldModule.type,
              config_data: oldModule.config_data,
            }
            methods.setValue(`config_data.modules.${moduleSelectionModalChangeIndex}`, changeModule)
            setTableKey((prevKey) => prevKey + 1)
          }
        }
      }
      setModuleSelectionModalFlag(false)
    },
    [values, append, setTableKey, setModuleSelectionModalFlag, methods.setValue, setTableKey]
  )

  const moduleSetSelectionModalClose = useCallback(
    (newModuleSet) => {
      if (newModuleSet) {
        const newModuleSetModules = newModuleSet.moduleset_modules.map((module, i) => {
          return {
            id: `${Date.now()}-${i}`,
            key: `${Date.now()}-${i}`,
            module_id: module.module_id,
            module_set_id: newModuleSet.id,
            module_name: module.module_name,
            tag: module.tag,
            type: module.type,
            config_data: module.default_config_data,
          }
        })
        append(newModuleSetModules)
      }
      setModuleSetSelectionModalFlag(false)
    },
    [append, setModuleSetSelectionModalFlag]
  )

  const moduleSettingModalOpen = useCallback(
    (index, settingData) => {
      setModuleSettingModalIndex(index)
      setModuleSettingModalData(settingData)
      setModuleSettingModalFlag(true)
    },
    [setModuleSettingModalIndex, setModuleSettingModalData, setModuleSettingModalFlag]
  )

  const moduleSettingModalSetData = useCallback(
    (value) => {
      if (moduleSettingModalIndex > -1) {
        methods.setValue(`config_data.modules.${moduleSettingModalIndex}.config_data`, value)
        setTableKey((prevKey) => prevKey + 1)
      }
    },
    [moduleSettingModalIndex, methods.setValue, setTableKey]
  )

  const onBack = () => {
    router.replace(Routes.MODULE_CONFIG)
  }

  const onSuccess = useCallback(() => {
    setModuleSelectionModalFlag(false)
  }, [setModuleSelectionModalFlag])

  const sorter = (a, b, key) => {
    return a[key] > b[key] ? 1 : -1
  }

  const columns = [
    {
      title: 'モジュール名',
      sorter: (a, b) => sorter(a, b, 'module_name'),
      dataIndex: 'module_name',
      className: 'min-w-[220px]',
      render: (text, record, index) => (
        <div className="flex w-[240px] cursor-pointer items-center gap-x-4 text-base">
          <span className="flex-[1_0_0]">{text}</span>
          <ExternalLinkIcon
            className="ml-auto shrink-0 cursor-pointer"
            onClick={() => moduleRadioSelectionModalOpen(index)}
          />
        </div>
      ),
    },
    {
      title: 'インスタンス名',
      sorter: (a, b) => sorter(a, b, 'module_instance'),
      dataIndex: 'module_instance',
      className: 'min-w-[356px]',
      render: (value, record, index) => (
        <Input
          {...methods.register(`config_data.modules.${index}.module_instance`)}
          defaultValue={value}
          name={`config_data.modules.${index}.module_instance`}
        />
      ),
    },
    {
      title: 'タグ',
      sorter: (a, b) => sorter(a, b, 'tag'),
      dataIndex: 'tag',
      className: 'min-w-[96px] text-base',
      render: (tag) => <div className="text-base">{tag || '-'}</div>,
    },
    {
      title: 'デプロイ先種別',
      sorter: (a, b) => sorter(a, b, 'type'),
      dataIndex: 'type',
      className: 'min-w-[272px]',
      render: (value, record, index) => (
        <Select
          {...methods.register(`config_data.modules.${index}.type`)}
          defaultValue={value}
          name={`config_data.modules.${index}.type`}
          placeholder=""
          options={[
            ...DEPLOYMENT_TYPE_OPTIONS,
            {
              label: 'Sim環境＋実機',
              value: '',
            },
          ]}
        />
      ),
    },
    {
      title: '設定値',
      sorter: (a, b) => sorter(a, b, 'config_data'),
      dataIndex: 'config_data',
      className: 'min-w-[200px]',
      render: (value, record, index) => (
        <Input
          {...methods.register(`config_data.modules.${index}.config_data`)}
          value={JSON.stringify(value)}
          name={`config_data.modules.${index}.config_data`}
          suffix={
            <ButtonIcon
              icon={<ExternalLinkIcon size={32} />}
              onClick={() => moduleSettingModalOpen(index, value)}
            />
          }
          disabled
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      className: 'min-w-[96px]',
      render: (id, record, index) => (
        <Space>
          <ButtonIcon onClick={() => remove(index)} icon={<TrashIcon size={32} />} />
        </Space>
      ),
    },
  ]

  return (
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
          {/* <DatePicker
            label="登録日"
            placeholder="登録日を入力してください。"
            name={FORM_MODULE_CONFIG.CREATE_DATE}
          />
          <DatePicker
            label="更新日"
            placeholder="更新日を入力してください。"
            name={FORM_MODULE_CONFIG.UPDATE_DATE}
          /> */}
        </div>

        <Space className="mb-6 flex justify-end">
          <Button
            type="outline"
            label="モジュールセット選択"
            icon={<ExternalLinkIcon size={46} />}
            onClick={() => setModuleSetSelectionModalFlag(true)}
          />
          <Button
            type="outline"
            label="モジュールを選択追加"
            icon={<AddIcon size={36} />}
            onClick={() => moduleCheckSelectionModalOpen()}
          />
          <Button
            icon={<AddIcon size={36} />}
            type="outline"
            label="新規モジュール追加"
            onClick={() => setModuleFormFlag(true)}
          />
        </Space>

        <Table
          id="table_form"
          rowKey="key"
          key={tableKey}
          pagination={false}
          columns={columns}
          data={values.config_data.modules}
        />
        {values.config_data.modules.length === 0 && (
          <div className="ant-form-item">
            <div className="ant-form-item-explain-error">モジュールを追加してください。</div>
          </div>
        )}
        <Space className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onBack}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold"> {isEdit ? '保存' : '登録'} </span>
          </Button>
        </Space>
      </Form>
      <ModuleSelectionModal
        open={moduleSelectionModalFlag}
        type={moduleSelectionModalType}
        onClose={moduleCheckSelectionModalClose}
      />
      <ModuleSetSelectionModal
        open={moduleSetSelectionModalFlag}
        onClose={moduleSetSelectionModalClose}
      />
      <ModuleForm
        open={moduleFormFlag}
        data={null}
        onSuccess={onSuccess}
        onClose={() => setModuleFormFlag(false)}
      />
      <ModuleSettingModal
        open={moduleSettingModalFlag}
        onClose={() => setModuleSettingModalFlag(false)}
        data={moduleSettingModalData}
        setData={moduleSettingModalSetData}
      />
    </FormProvider>
  )
}

export default ModuleConfigForm

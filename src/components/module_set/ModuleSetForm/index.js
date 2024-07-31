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
import { ModuleSelectionModal } from '@/components/module_selection'
import { RowDate } from '@/components/table'
import { Button, ButtonIcon, Table } from '@/components/ui'

import { FORM_MODULE_SET, moduleSetSchema } from '@/validations/moduleSetSchema'

const ModuleSetForm = ({ isEdit, onSubmit, data }) => {
  const router = useRouter()

  const [tableKey, setTableKey] = useState(0)
  const [moduleSelectionModalFlag, setModuleSelectionModalFlag] = useState(false)
  const [moduleSelectionModalType, setModuleSelectionModalType] = useState('checkbox')
  const [moduleSelectionModalChangeIndex, setModuleSelectionModalChangeIndex] = useState(null)
  const [moduleFormFlag, setModuleFormFlag] = useState(false)
  const [moduleSettingModalIndex, setModuleSettingModalIndex] = useState(-1)
  const [moduleSettingModalFlag, setModuleSettingModalFlag] = useState(false)
  const [moduleSettingModalData, setModuleSettingModalData] = useState(null)

  const methods = useForm({
    resolver: yupResolver(moduleSetSchema),
    defaultValues: {
      name: '',
      description: '',
      moduleset_modules: [],
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
    name: 'moduleset_modules',
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
          const newModuleSetModules = newModules
            .map((module, i) =>
              module.tags.map((tag, j) => {
                return {
                  key: `${Date.now()}-${i}-${j}`,
                  name: module.name,
                  module_id: module.id,
                  tag: tag.name,
                  type: '',
                  default_config_data: {},
                  create_date: module.create_date,
                  update_date: module.update_date,
                }
              })
            )
            .flat()
          append(newModuleSetModules)
          setTableKey((prevKey) => prevKey + 1)
        }
        if (moduleSelectionModalType === 'radio') {
          const newModule = newModules[0]
          const oldModule = values.moduleset_modules[moduleSelectionModalChangeIndex]
          if (newModule && oldModule) {
            const changeModule = {
              key: `${Date.now()}`,
              name: newModule.name,
              module_id: newModule.id,
              tag: newModule.tags[0].name,
              type: oldModule.type,
              default_config_data: oldModule.default_config_data,
              create_date: newModule.create_date,
              update_date: newModule.update_date,
            }
            methods.setValue(`moduleset_modules.${moduleSelectionModalChangeIndex}`, changeModule)
            setTableKey((prevKey) => prevKey + 1)
          }
        }
      }
      setModuleSelectionModalFlag(false)
    },
    [values, append, setTableKey, setModuleSelectionModalFlag, methods.setValue, setTableKey]
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
        methods.setValue(`moduleset_modules.${moduleSettingModalIndex}.default_config_data`, value)
        setTableKey((prevKey) => prevKey + 1)
      }
    },
    [moduleSettingModalIndex, methods.setValue, setTableKey]
  )

  const onBack = useCallback(() => {
    router.replace(Routes.MODULE_SET)
  }, [router])

  const onSuccess = useCallback(() => {
    setModuleSelectionModalFlag(false)
  }, [setModuleSelectionModalFlag])

  const sorter = (a, b, key) => {
    return a[key] > b[key] ? 1 : -1
  }

  const columns = [
    {
      title: 'モジュール名',
      sorter: (a, b) => sorter(a, b, 'name'),
      dataIndex: 'name',
      sorter: true,
      className: 'min-w-[200px]',
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
      title: 'タグ',
      sorter: (a, b) => sorter(a, b, 'tag'),
      dataIndex: 'tag',
      sorter: true,
      className: 'min-w-[96px]',
      render: (value, record, index) => (
        <Input
          {...methods.register(`moduleset_modules.${index}.tag`)}
          defaultValue={value}
          name={`moduleset_modules.${index}.tag`}
        />
      ),
    },
    {
      title: 'デプロイ先種別',
      sorter: (a, b) => sorter(a, b, 'type'),
      dataIndex: 'type',
      sorter: true,
      className: 'min-w-[272px]',
      render: (value, record, index) => (
        <Select
          {...methods.register(`moduleset_modules.${index}.type`)}
          defaultValue={value}
          name={`moduleset_modules.${index}.type`}
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
      sorter: (a, b) => sorter(a, b, 'default_config_data'),
      dataIndex: 'default_config_data',
      className: 'min-w-[356px]',
      render: (value, record, index) => (
        <Input
          {...methods.register(`moduleset_modules.${index}.default_config_data`)}
          value={JSON.stringify(value)}
          name={`moduleset_modules.${index}.default_config_data`}
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
      title: '登録日',
      sorter: (a, b) => sorter(a, b, 'create_date'),
      dataIndex: 'create_date',
      sorter: true,
      className: 'min-w-[124px]',
      render: (text) => <RowDate item={text} />,
    },
    {
      title: '更新日',
      sorter: (a, b) => sorter(a, b, 'update_date'),
      dataIndex: 'update_date',
      sorter: true,
      className: 'min-w-[124px]',
      render: (text) => <RowDate item={text} />,
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
            label="モジュールセット名:"
            name={FORM_MODULE_SET.NAME}
            placeholder="モジュールセット名を入力してください。"
          />
          <InputTextArea
            label="説明:"
            name={FORM_MODULE_SET.DESCRIPTION}
            placeholder="説明を入力してください。"
            rows={4}
          />
        </div>

        <Space className="mb-6 flex justify-end">
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
          data={values.moduleset_modules}
          onChange={onTableChange}
        />

        <Space className="flex-end mt-12 gap-x-4">
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold">{isEdit ? '保存' : '登録'}</span>
          </Button>
          <Button type="default" className="min-w-[200px]" onClick={onBack}>
            <span className="font-semibold">キャンセル</span>
          </Button>
        </Space>
      </Form>
      <ModuleSelectionModal
        open={moduleSelectionModalFlag}
        type={moduleSelectionModalType}
        onClose={moduleCheckSelectionModalClose}
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

export default ModuleSetForm

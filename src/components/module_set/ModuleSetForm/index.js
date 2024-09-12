import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Space } from 'antd'
import orderBy from 'lodash/orderBy'

import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import { DEPLOYMENT_TYPE_OPTIONS, Routes } from '@/constants'

import { Input, InputTextArea, Select } from '@/components/form'
import { AddIcon, ExternalLinkIcon, TrashIcon, WarningIcon } from '@/components/icons'
import { ModuleForm, ModuleSettingModal } from '@/components/module'
import { ModuleSelectionModal } from '@/components/module_selection'
import { RowContent, RowDate } from '@/components/table'
import { Button, ButtonIcon, Table } from '@/components/ui'

import { FORM_MODULE_SET, moduleSetSchema } from '@/validations/moduleSetSchema'

const ModuleSetForm = ({ action, onSubmit, data }) => {
  const router = useRouter()

  const [tableKey, setTableKey] = useState(0)
  const [moduleSelectionModalFlag, setModuleSelectionModalFlag] = useState(false)
  const [moduleSelectionModalType, setModuleSelectionModalType] = useState('checkbox')
  const [moduleSelectionModalChangeIndex, setModuleSelectionModalChangeIndex] = useState(null)
  const [moduleFormModalFlag, setModuleFormModalFlag] = useState(false)
  const [moduleSettingModalIndex, setModuleSettingModalIndex] = useState(-1)
  const [moduleSettingModalFlag, setModuleSettingModalFlag] = useState(false)
  const [moduleSettingModalData, setModuleSettingModalData] = useState(null)
  const [sortedInfo, setSortedInfo] = useState({ field: undefined, order: undefined })

  const methods = useForm({
    resolver: action !== 'delete' ? yupResolver(moduleSetSchema) : undefined,
    defaultValues: {
      name: '',
      description: '',
      moduleset_modules: [],
    },
  })

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

  const appendModulesToSet = useCallback(
    (newModules) => {
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
    },
    [values, append]
  )

  const moduleFormModalClose = useCallback(
    (module) => {
      if (module) {
        appendModulesToSet([module])
        setTableKey((prevKey) => prevKey + 1)
      }
      setModuleFormModalFlag(false)
    },
    [appendModulesToSet, setTableKey, setModuleFormModalFlag]
  )

  const moduleCheckSelectionModalClose = useCallback(
    (newModules = null) => {
      if (newModules) {
        if (moduleSelectionModalType === 'checkbox') {
          appendModulesToSet(newModules)
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

  const onTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter)
  }

  const buttonLabel = useMemo(() => {
    if (action === 'edit') return '保存'
    if (action === 'delete') return '削除'
    return '登録'
  }, [action])

  useEffect(() => {
    if (data) {
      const defaultValues = {
        id: data.id,
        name: data.name,
        description: data.description,
        moduleset_modules: data.moduleset_modules.map((module, i) => {
          return {
            key: `${Date.now()}-${i}`,
            name: module.module_name,
            module_id: module.module_id,
            tag: module.tag,
            type: module.type,
            default_config_data: module.default_config_data,
            create_date: module.create_date,
            update_date: module.update_date,
            is_deleted: module.is_deleted,
          }
        }),
      }
      methods.reset(defaultValues)
    }
  }, [data])

  useEffect(() => {
    if (sortedInfo.field !== undefined && sortedInfo.field !== undefined) {
      const column = sortedInfo.field
      const order = sortedInfo.order === 'descend' ? 'desc' : 'asc'
      const orderedModules = orderBy(values.moduleset_modules, [column], [order])
      methods.setValue('moduleset_modules', orderedModules)
    }
  }, [sortedInfo])

  const columns = [
    {
      title: 'モジュール名',
      dataIndex: 'name',
      sorter: true,
      className: 'min-w-[200px]',
      render: (text, record, index) => (
        <div className="flex w-[240px] cursor-pointer items-center gap-x-4 text-base">
          <div className="flex-[1_0_0]">
            <RowContent item={text} className="flex-[1_0_0]" />
            {record.is_deleted && ( // is_deletedがtrueの場合に表示
              <div className="mt-2 flex items-center gap-x-2">
                <WarningIcon className="h-4 w-4" />
                <span className="text-red-600">削除されたモジュール</span>
              </div>
            )}
          </div>
          <ExternalLinkIcon
            className="ml-auto shrink-0 cursor-pointer"
            onClick={() => moduleRadioSelectionModalOpen(index)}
            disabled={action === 'delete'}
          />
        </div>
      ),
    },
    {
      title: 'タグ',
      dataIndex: 'tag',
      sorter: true,
      className: 'min-w-[96px]',
      render: (value, record, index) => (
        <Input
          {...methods.register(`moduleset_modules.${index}.tag`)}
          defaultValue={value}
          name={`moduleset_modules.${index}.tag`}
          disabled={action === 'delete'}
        />
      ),
    },
    {
      title: 'デプロイ先種別',
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
          disabled={action === 'delete'}
        />
      ),
    },
    {
      title: '設定値',
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
              disabled={action === 'delete'}
            />
          }
          disabled
        />
      ),
    },
    {
      title: '登録日',
      dataIndex: 'create_date',
      sorter: true,
      className: 'min-w-[124px]',
      render: (text) => <RowDate item={text} />,
    },
    {
      title: '更新日',
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
          <ButtonIcon
            onClick={() => remove(index)}
            icon={<TrashIcon size={32} />}
            disabled={action === 'delete'}
          />
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
            disabled={action === 'delete'}
          />
          <InputTextArea
            label="説明:"
            name={FORM_MODULE_SET.DESCRIPTION}
            placeholder="説明を入力してください。"
            rows={4}
            disabled={action === 'delete'}
          />
        </div>

        <Space className="mb-6 flex justify-end">
          <Button
            type="outline"
            label="モジュールを選択追加"
            icon={<AddIcon size={36} />}
            onClick={() => moduleCheckSelectionModalOpen()}
            disabled={action === 'delete'}
          />
          <Button
            icon={<AddIcon size={36} />}
            type="outline"
            label="新規モジュール追加"
            onClick={() => setModuleFormModalFlag(true)}
            disabled={action === 'delete'}
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
        {methods.formState.errors.moduleset_modules?.root?.message && (
          <div className="ant-form-item">
            <div className="ant-form-item-explain-error">
              {methods.formState.errors.moduleset_modules?.root?.message}
            </div>
          </div>
        )}

        <Space className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onBack}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold">{buttonLabel}</span>
          </Button>
        </Space>
      </Form>
      <ModuleSelectionModal
        open={moduleSelectionModalFlag}
        type={moduleSelectionModalType}
        onClose={moduleCheckSelectionModalClose}
      />
      <ModuleForm open={moduleFormModalFlag} data={null} onClose={moduleFormModalClose} />
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

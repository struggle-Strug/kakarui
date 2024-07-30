import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useFlag } from '@/hooks/share'

import { Input, InputTextArea, Select } from '@/components/form'
import { ExternalLinkIcon } from '@/components/icons'
import { SearchBar } from '@/components/layout/dashboard'
import { ColumnSorter } from '@/components/table'
import { Button, ButtonIcon, Table } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

import configData from '@/services/mock-data/config_data'
import { moduleSettingSchema } from '@/validations/moduleSchema'

const ModuleSettingForm = ({ open, onClose, data, setData }) => {
  // const [{ filter, sort, search }] = useQueryStates({
  //   filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
  //   sort: parseAsArrayOf(parseAsString, ',').withDefault(),
  //   search: parseAsString,
  // })

  // const reload = () => {
  //   moduleSettingApiStub.getData(filter, sort, search).then(setData)
  // }

  // useEffect(() => {
  //   reload()
  // }, [filter, sort, search])

  // const searchOptions = getSearchOptions(values, ['key', 'value'])

  const defaultValues = useMemo(() => {
    const parseData = data && data !== '' && Object.keys(data).length !== 0 ? data : configData
    const parseValues = Object.keys(parseData).map((key) => {
      const value =
        typeof parseData[key] === 'string' ? parseData[key] : JSON.stringify(parseData[key])
      return { key, value }
    })
    return {
      config_data: parseValues,
    }
  }, [data])

  const methods = useForm({
    resolver: yupResolver(moduleSettingSchema),
    defaultValues: {
      config_data: [],
    },
  })

  const values = methods.getValues()

  useEffect(() => {
    methods.reset(defaultValues)
  }, [data])

  const onSubmit = useCallback(
    (formData) => {
      const objectData = formData.config_data.reduce((acc, cur) => {
        let value = ''
        try {
          value = JSON.parse(cur.value)
        } catch {
          value = cur.value
        }
        acc[cur.key] = value
        return acc
      }, {})
      setData(objectData)
    },
    [setData]
  )

  const columns = [
    {
      title: <ColumnSorter title={<span>プロパティ</span>} field="key" />,
      dataIndex: 'key',
      className: 'min-w-[248px]',
      render: (value) => <div className="text-base">{value}</div>,
    },
    {
      title: <ColumnSorter title="設定" field="value" />,
      dataIndex: 'value',
      className: 'min-w-[440px]',
      render: (value, record, index) => (
        <Input
          ref={methods.ref}
          {...methods.register(`config_data.${index}.value`)}
          defaultValue={value}
          name={`config_data.${index}.value`}
        />
      ),
    },
  ]

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<h1 className="text-lg font-semibold text-dark-gray-3">モジュール設定</h1>}
      className="rounded-3xl"
      footer={null}
      width={1280}
    >
      <div className="space-y-6 px-12 pb-16 font-light">
        <h3 className="text-lg text-primary">以下のプロパティを設定してください。</h3>
        <div>{/* <SearchBar placeholder="プロパティ" options={searchOptions} disabled /> */}</div>
        <FormProvider {...methods}>
          <Form onFinish={methods.handleSubmit(onSubmit)} layout="horizontal">
            <Table rowKey="key" pagination={false} columns={columns} data={values.config_data} />
            <div className="flex-end mt-12 gap-x-4">
              <Button type="default" className="min-w-[200px]" onClick={onClose}>
                <span className="font-semibold">キャンセル</span>
              </Button>
              <Button type="primary" htmlType="submit" className="min-w-[200px]">
                <span className="font-semibold"> 設定 </span>
              </Button>
            </div>
          </Form>
        </FormProvider>
      </div>
    </Modal>
  )
}

const ModuleSettingModalButton = ({ data, setData }) => {
  const [open, onOpen, onClose] = useFlag()

  return (
    <>
      <ButtonIcon icon={<ExternalLinkIcon size={32} />} onClick={onOpen} />
      {open && <ModuleSettingForm open={open} onClose={onClose} data={data} setData={setData} />}
    </>
  )
}

export default ModuleSettingModalButton

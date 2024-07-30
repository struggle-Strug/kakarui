import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal } from 'antd'
import { includes, toLower } from 'lodash'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useFlag } from '@/hooks/share'

import { Input } from '@/components/form'
import { ExternalLinkIcon } from '@/components/icons'
import { SearchBar } from '@/components/layout/dashboard'
import { ColumnSorter } from '@/components/table'
import { Button, ButtonIcon, Table } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

import configData from '@/services/mock-data/config_data'
import { moduleSettingSchema } from '@/validations/moduleSchema'

const ModuleSettingForm = ({ open, onClose, data, setData }) => {
  const [{ sort, search }, setQueryState] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const defaultValues = useMemo(() => {
    const parseData = data && data !== '' && Object.keys(data).length !== 0 ? data : configData
    const parseValues = Object.keys(parseData).map((key, index) => {
      const value =
        typeof parseData[key] === 'string' ? parseData[key] : JSON.stringify(parseData[key])
      return { key, value, index }
    })
    return {
      config_data: parseValues,
    }
  }, [data])

  const methods = useForm({
    resolver: yupResolver(moduleSettingSchema),
    defaultValues,
  })

  const values = methods.getValues()

  const searchOptions = getSearchOptions(values.config_data, ['key', 'value'])

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

  const filteredData = useMemo(() => {
    const searchTerm = toLower(search)
    return values.config_data.filter((record) => includes(toLower(record.key), searchTerm))
  }, [values.config_data, search])

  const sorter = (a, b, key) => {
    return a[key] > b[key] ? 1 : -1
  }

  useEffect(() => {
    setQueryState({ search: '' })
  }, [data])

  const columns = [
    {
      title: 'プロパティ',
      dataIndex: 'key',
      className: 'min-w-[248px]',
      render: (value) => <div className="text-base">{value}</div>,
      sorter: (a, b) => sorter(a, b, 'key'),
    },
    {
      title: '設定',
      dataIndex: 'value',
      className: 'min-w-[440px]',
      sorter: (a, b) => sorter(a, b, 'value'),
      render: (value, record, index) => (
        <Input
          ref={methods.ref}
          {...methods.register(`config_data.${record.index}.value`)}
          defaultValue={value}
          name={`config_data.${record.index}.value`}
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
        <div>
          <SearchBar placeholder="プロパティ" options={searchOptions} />
        </div>
        <FormProvider {...methods}>
          <Form onFinish={methods.handleSubmit(onSubmit)} layout="horizontal">
            <Table rowKey="key" pagination={false} columns={columns} data={filteredData} />
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

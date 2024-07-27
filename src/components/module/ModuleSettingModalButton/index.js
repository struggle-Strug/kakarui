import { Form, Modal, Spin } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useLoadingSimulation } from '@/hooks/custom'
import { useFlag } from '@/hooks/share'
import moduleSettingApiStub from '@/hooks/stub/module_setting'

import { ExternalLinkIcon } from '@/components/icons'
import { SearchBar } from '@/components/layout/dashboard'
import { Button, ButtonIcon } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

import ModuleSettingTableForm from './ModuleSettingTableForm'

const ModuleSettingForm = ({ open, onClose }) => {
  const [loading, startLoading] = useLoadingSimulation()
  const [data, setData] = useState([])

  const [{ filter, sort, search }] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const reload = () => {
    moduleSettingApiStub.getData(filter, sort, search).then(setData)
  }

  useEffect(() => {
    reload()
  }, [filter, sort, search])

  const defaultValues = useMemo(() => ({}), [])

  const methods = useForm()

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const onSubmit = (values) => {
    // eslint-disable-next-line no-console
    console.log(values)

    startLoading(() => {
      onClose()
    })
  }

  const renderForm = (
    <FormProvider {...methods}>
      <Form onFinish={methods.handleSubmit(onSubmit)} layout="horizontal">
        <ModuleSettingTableForm data={data} />
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
  )

  const searchOptions = getSearchOptions(moduleSettingApiStub.getRawData(), [
    'property',
    'settings',
  ])

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
        <Spin spinning={loading}>
          <div className="p-12 text-base">{renderForm}</div>
        </Spin>
      </div>
    </Modal>
  )
}

const ModuleSettingModalButton = () => {
  const [open, onOpen, onClose] = useFlag()

  return (
    <>
      <ButtonIcon icon={<ExternalLinkIcon size={32} />} onClick={onOpen} />
      {open && <ModuleSettingForm open={open} onClose={onClose} />}
    </>
  )
}

export default ModuleSettingModalButton

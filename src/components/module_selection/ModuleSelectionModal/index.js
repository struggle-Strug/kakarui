import { Form, Modal, Spin } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useLoadingSimulation } from '@/hooks/custom'
import moduleSetSelectionApiStub from '@/hooks/stub/module_selection'

import { SearchBar } from '@/components/layout/dashboard'
import { Button } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

// import data from '@/services/mock-data/module_selection_set.json'
import ModuleSelectionTableForm from './ModuleSelectionTableForm'

const ModuleSelectionModal = ({ open, onClose }) => {
  const [loading, startLoading] = useLoadingSimulation()
  const [data, setData] = useState([])

  const [{ filter, sort, search }] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const reload = () => {
    moduleSetSelectionApiStub.getModuleSetSelection(filter, sort, search).then(setData)
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
        <ModuleSelectionTableForm data={data} />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onClose}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold"> 選択 </span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<h1 className="text-lg font-semibold text-dark-gray-3">モジュール選択</h1>}
      className="rounded-3xl"
      footer={null}
      width={1280}
    >
      <div className="space-y-6 px-12 pb-16 font-light">
        <h3 className="text-lg text-primary">モジュールを選択してください。</h3>
        <div className="flex items-center gap-x-6 text-lg">
          <div>モジュール</div>
          <div>1,104 件</div>
          <SearchBar
            placeholder="モジュール名・説明"
            options={getSearchOptions(data, ['name', 'description'])}
          />
        </div>
        <Spin spinning={loading}>
          <div className="p-12 text-base">{renderForm}</div>
        </Spin>
      </div>
    </Modal>
  )
}

export default ModuleSelectionModal

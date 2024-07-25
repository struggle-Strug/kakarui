import { Modal } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useState } from 'react'

import { useModuleSetSelectionQuery } from '@/hooks/query'

import { SearchBar } from '@/components/layout/dashboard'
import { Button } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

import ModuleSetSelectionTableForm from './ModuleSetSelectionTableForm'

const ModuleSetSelectionModal = ({ open, onClose }) => {
  const [selected, setSelected] = useState(null)

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching } = useModuleSetSelectionQuery({ search, sort })

  const searchOptions = getSearchOptions(data, ['name'])

  return (
    <Modal
      open={open}
      onCancel={() => onClose()}
      title={<h1 className="text-lg font-semibold text-dark-gray-3">モジュールセット選択</h1>}
      className="rounded-3xl"
      footer={null}
      width={1280}
    >
      <div className="space-y-6 px-12 pb-16 font-light">
        <h3 className="text-lg text-primary">モジュールセットを選択してください。</h3>
        <SearchBar placeholder="モジュールセット名・説明" options={searchOptions} />
        <ModuleSetSelectionTableForm
          data={filteredData}
          loading={isLoading || isFetching}
          total={filteredData.length}
          selected={selected}
          setSelected={setSelected}
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={() => onClose()}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="min-w-[200px]"
            onClick={() => onClose(selected)}
          >
            <span className="font-semibold"> 選択 </span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ModuleSetSelectionModal

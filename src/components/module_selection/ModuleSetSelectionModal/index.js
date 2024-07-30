import { Modal } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useState } from 'react'

import { useModuleSetSelectionQuery } from '@/hooks/query'

import { SearchBar } from '@/components/layout/dashboard'
import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Button, Table } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleSetSelectionModal = ({ open, onClose }) => {
  const [selected, setSelected] = useState(null)

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching } = useModuleSetSelectionQuery({ search, sort })

  const searchOptions = getSearchOptions(data, ['name'])

  const columns = [
    {
      title: <ColumnSorter title="モジュールセット名" field="name" />,
      dataIndex: 'name',
      className: 'min-w-[248px]',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    },
    {
      title: <ColumnSorter title="説明" field="description" />,
      dataIndex: 'description',
      className: 'min-w-[320px]',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    },
    {
      title: <ColumnSorter title="登録日" field="create_date" />,
      dataIndex: 'create_date',
      className: 'min-w-[124px]',
      render: (text) => <RowDate item={text} />,
    },
    {
      title: <ColumnSorter title="更新日" field="update_date" />,
      dataIndex: 'update_date',
      className: 'min-w-[124px]',
      render: (text) => <RowDate item={text} />,
    },
  ]

  const onSelectChange = (newSelected) => {
    setSelected(newSelected)
  }

  const rowSelection = {
    type: 'radio',
    onSelect: onSelectChange,
  }

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
        <Table
          pagination={{}}
          rowSelection={rowSelection}
          total={filteredData.length}
          loading={isLoading || isFetching}
          columns={columns}
          data={filteredData}
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

import { Modal } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useModuleSelectionQuery } from '@/hooks/query'

import { SearchBar } from '@/components/layout/dashboard'
import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Button, Table } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const ModuleSelectionModal = ({ open, onClose, type }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedModules, setSelectedModules] = useState(null)

  useEffect(() => {
    setSelectedRowKeys([])
    setSelectedModules([])
  }, [])

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching } = useModuleSelectionQuery({ search, sort })

  const searchOptions = getSearchOptions(data, ['name'])

  const onSelect = useCallback(() => {
    onClose(selectedModules)
  }, [onClose, selectedModules])

  const rowSelection = useMemo(() => {
    return {
      type,
      selectedRowKeys,
      onChange: (newSelectedRowKeys, selectedRows) => {
        const idTags = selectedRows.reduce((result, row) => {
          const id = row.parent ? row.parent : row.id
          const tag = row.tags
            ? row.tags.find((item) => row.latest_tag.includes(item.name))?.name
            : row.latest_tag
          if (tag) {
            if (result[id]) {
              result[id].push(tag)
            } else {
              result[id] = [tag]
            }
          }
          return result
        }, {})
        const modules = filteredData
          .filter((module) => idTags[module.id])
          .map((module) => {
            return {
              ...module,
              tags: module.tags.filter((tag) => idTags[module.id].includes(tag.name)),
            }
          })
        setSelectedRowKeys(newSelectedRowKeys)
        setSelectedModules(modules)
      },
    }
  }, [type, selectedRowKeys, setSelectedRowKeys, setSelectedModules, filteredData])

  const tableData = useMemo(() => {
    return filteredData.map((item, i) => {
      const children = item.tags
        .filter((tag) => !item.latest_tag.includes(tag.name))
        .map((tag, j) => {
          return {
            id: `${item.id}-${i}-${j}`,
            parent: item.id,
            key: `${item.id}-${j}`,
            name: '',
            latest_tag: tag.name,
            description: '',
            create_date: tag.create_date,
            update_date: tag.update_date,
          }
        })
      if (children.length) {
        return {
          ...item,
          key: `${item.id}`,
          children,
        }
      }
      return {
        ...item,
        key: `${item.id}`,
      }
    })
  }, [filteredData])

  const columns = [
    {
      title: <ColumnSorter title={<span>モジュール名</span>} field="name" />,
      dataIndex: 'name',
      className: 'min-w-[248px]',
      render: (text) => (
        <div className="flex w-[248px] cursor-pointer items-center gap-x-4 text-base">
          <span>{text.replace(/\\(["'])/g, '$1')}</span>
        </div>
      ),
    },
    {
      title: <ColumnSorter title="タグ" field="latest_tag" />,
      dataIndex: 'latest_tag',
      className: 'min-w-[100px]',
      render: (item) => <RowContent item={item} className="max-w-[440px]" />,
    },
    {
      title: <ColumnSorter title="説明" field="description" />,
      dataIndex: 'description',
      className: 'min-w-[300px]',
      render: (item) => <RowContent item={item} className="max-w-[440px]" />,
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

  return (
    <Modal
      open={open}
      onCancel={() => onClose()}
      title={<h1 className="text-lg font-semibold text-dark-gray-3">モジュール選択</h1>}
      className="rounded-3xl"
      footer={null}
      width={1280}
    >
      <div className="space-y-6 px-12 pb-16 font-light">
        <h3 className="text-lg text-primary">モジュールを選択してください。</h3>
        <div className="flex items-center gap-x-6 text-lg">
          <div>モジュール</div>
          <div>{data.length} 件</div>
          <SearchBar placeholder="モジュール名・説明" options={searchOptions} />
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          loading={isLoading || isFetching}
          data={tableData}
          rowKey="id"
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={() => onClose()}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button onClick={onSelect} type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold"> 選択 </span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ModuleSelectionModal

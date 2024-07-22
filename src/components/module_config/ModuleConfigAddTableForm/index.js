import { Space } from 'antd'

import { useState } from 'react'

import { DEPLOYMENT_TYPE_OPTIONS } from '@/constants'

import { ExternalLinkIcon, TrashIcon } from '@/components/icons'
import { ModuleSettingModalButton } from '@/components/module'
import { ModuleSelectionModal } from '@/components/module_selection'
import { ColumnSorter, RowDate } from '@/components/table'
import { ButtonIcon, Input, Select, Table } from '@/components/ui'

const ModuleConfigAddTableForm = ({ data, setSelectedModule }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [moduleSetId, setModuleSetId] = useState(null)

  const columns = [
    {
      title: <ColumnSorter title="モジュール名" field="module_name" />,
      dataIndex: 'module_name',
      className: 'min-w-[220px]',
      render: (text, { module_id: id }) => (
        <div className="flex w-[220px] cursor-pointer gap-x-4 text-base">
          <span>{text}</span>
          <ExternalLinkIcon
            className="ml-auto cursor-pointer"
            onClick={() => id && setModuleSetId(id)}
          />
        </div>
      ),
    },
    {
      title: <ColumnSorter title="インスタンス名" field="module_instance" />,
      dataIndex: 'module_instance',
      className: 'min-w-[356px]',
      render: (value) => (
        <div>
          <Input className="min-w-[356px]" value={value} placeholder=" " />
        </div>
      ),
    },
    {
      title: <ColumnSorter title="タグ" field="tag" />,
      dataIndex: 'tag',
      className: 'min-w-[96px] text-base',
      render: (tag) => <div className="text-base">{tag || '-'}</div>,
    },
    {
      title: <ColumnSorter title="デプロイ先種別" field="type" />,
      dataIndex: 'type',
      className: 'min-w-[272px]',
      render: (value) => (
        <div>
          <Select
            className="min-w-[272px]"
            options={DEPLOYMENT_TYPE_OPTIONS}
            placeholder=" "
            value={value}
          />
        </div>
      ),
    },
    {
      title: <ColumnSorter title="設定値" field="create_date" />,
      dataIndex: 'create_date',
      className: 'min-w-[200px]',
      render: (value) => <RowDate item={value} />,
    },
    {
      title: <span className="text-center text-base">操作</span>,
      dataIndex: 'id',
      align: 'center',
      className: 'min-w-[96px]',
      render: () => (
        <Space>
          <ModuleSettingModalButton />
          <ButtonIcon icon={<TrashIcon size={32} />} />
        </Space>
      ),
    },
  ]

  const onSelectChange = (newSelectedRowKeys, selectRowData) => {
    setSelectedModule(selectRowData)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <>
      <Table
        rowKey="module_id"
        rowSelection={rowSelection}
        pagination={{ hideOnSinglePage: true }}
        columns={columns}
        data={data}
      />
      <ModuleSelectionModal
        open={!!moduleSetId}
        moduleSetId={moduleSetId}
        onClose={() => setModuleSetId(null)}
      />
    </>
  )
}

export default ModuleConfigAddTableForm

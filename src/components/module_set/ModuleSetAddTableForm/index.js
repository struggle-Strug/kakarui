import { Space } from 'antd'

import { useState } from 'react'

import { ExternalLinkIcon, TrashIcon } from '@/components/icons'
import { ModuleSelectionModal } from '@/components/module_selection'
import { ColumnSorter, RowDate } from '@/components/table'
import { ButtonIcon, Input, Select, Table } from '@/components/ui'

const ModuleSetAddTableForm = ({ data }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [moduleSetId, setModuleSetId] = useState(null)

  const columns = [
    {
      title: <ColumnSorter title={<span> モジュール名</span>} field="name" />,
      dataIndex: 'name',
      className: 'min-w-[200px]',
      render: (text, { module_id: id }) => (
        <div className="flex w-[240px] cursor-pointer items-center gap-x-4 text-base">
          <span>{text}</span>
          <ExternalLinkIcon
            className="ml-auto shrink-0 cursor-pointer"
            onClick={() => id && setModuleSetId(id)}
          />
        </div>
      ),
    },
    {
      title: <ColumnSorter title="タグ" field="tag" />,
      dataIndex: 'tag',
      className: 'min-w-[96px]',
      render: (tag) => <div className="text-base">{tag || '-'}</div>,
    },
    {
      title: <ColumnSorter title="デプロイ先種別" field="type" />,
      dataIndex: 'type',
      className: 'min-w-[272px]',
      render: () => (
        <div>
          <Select className="min-w-[272px]" placeholder=" " />
        </div>
      ),
    },
    {
      title: <ColumnSorter title="設定値" field="settingValue" />,
      dataIndex: 'settingValue',
      className: 'min-w-[356px]',
      render: () => (
        <div>
          <Input className="min-w-[356px]" suffix={<ExternalLinkIcon />} placeholder=" " />
        </div>
      ),
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
    {
      title: <span className="text-center text-base">操作</span>,
      dataIndex: 'id',
      align: 'center',
      className: 'min-w-[96px]',
      render: () => (
        <Space>
          <ButtonIcon icon={<TrashIcon size={32} />} />
        </Space>
      ),
    },
  ]

  const onSelectChange = (newSelectedRowKeys) => {
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

export default ModuleSetAddTableForm

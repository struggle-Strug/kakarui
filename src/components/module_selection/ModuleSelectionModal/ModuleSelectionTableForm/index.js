/* eslint-disable react/no-array-index-key */
import { useState } from 'react'

import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { Table } from '@/components/ui'

// const header = {
//   name: 'モジュール名',
//   tag: 'タグ',
//   description: '説明',
//   created: '登録日',
//   updated: '更新日',
// }

const ModuleSelectionTableForm = ({ data }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // const [collapsedId, setCollapsedId] = useState(null)

  // const renderHeaderChecked = (
  //   <div>
  //     <Checkbox checked />
  //   </div>
  // )

  // const renderBodyChecked = (
  //   <div>
  //     <Checkbox checked />
  //   </div>
  // )

  // const renderCollapseToggle = (rowId) => (
  //   <div>
  //     <TriangleIcon
  //       color="#166CFF"
  //       className={cn(
  //         'cursor-pointer transition-transform',
  //         collapsedId === rowId ? 'rotate-180' : 'rotate-90'
  //       )}
  //       onClick={() => setCollapsedId(!collapsedId ? rowId : null)}
  //     />
  //   </div>
  // )

  // const renderTableHead = () =>
  //   Object.keys(header).map((key) => (
  //     <th key={key}>
  //       <div className="flex items-center gap-x-4">
  //         {key === 'name' && renderHeaderChecked}
  //         {header[key]}
  //       </div>
  //     </th>
  //   ))

  // const renderTableBody = (arr, isChild) =>
  //   arr.map((row, index) => {
  //     const hasConfigData = row?.config_data?.length > 0

  //     return (
  //       <>
  //         <tr
  //           key={index}
  //           className={cn(
  //             { 'border-x-0 border-b-0 border-t border-solid border-dark-gray-3': !isChild },
  //             isChild ? 'py-1' : 'py-3'
  //           )}
  //         >
  //           {Object.keys(header).map((key) => (
  //             <td key={`${index}-${key}`} className="max-w-[400px]">
  //               <div className="flex items-center gap-x-4">
  //                 {key === 'name' && renderBodyChecked}
  //                 {key === 'created' || key === 'updated' ? formatDate(row[key]) : row[key]}
  //                 {key === 'name' && hasConfigData && renderCollapseToggle(row?.id)}
  //               </div>
  //             </td>
  //           ))}
  //         </tr>
  //         {collapsedId === row?.id && hasConfigData && renderTableBody(row.config_data, true)}
  //       </>
  //     )
  // })

  const columns = [
    {
      title: <ColumnSorter title={<span>モジュール名</span>} field="name" />,
      dataIndex: 'name',
      className: 'min-w-[248px]',
      render: (text) => (
        <div className="flex w-[248px] cursor-pointer items-center gap-x-4 text-base">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: <ColumnSorter title="タグ" field="tag" />,
      dataIndex: 'tag',
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

  const expandedRowRender = (record) => {
    return (
      <div>
        {record.config_data && record.config_data.length > 0 && (
          <div>
            {record.config_data.map((config) => (
              <div key={config.id} style={{ display: 'flex' }}>
                <div style={{ width: '140px' }} />
                <div className="flex min-w-[248px] items-center gap-x-4">
                  <span>{config.name || 'N/A'}</span>
                </div>
                <div className="min-w-[100px]">
                  <RowContent item={config.tag} className="max-w-[440px]" />
                </div>
                <div className="min-w-[300px]">
                  <RowContent item={config.description} className="max-w-[400px]" />
                </div>
                <div className="min-w-[124px]">
                  <RowDate item={config.create_date} />
                </div>
                <div className="min-w-[124px]">
                  <RowDate item={config.update_date} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Table
      rowSelection={rowSelection}
      pagination={{ defaultPageSize: 30 }}
      columns={columns}
      data={data}
      expandable={{
        expandedRowRender,
        rowExpandable: (record) => record.config_data && record.config_data.length > 0,
      }}
      rowKey="id"
    />
  )
}

export default ModuleSelectionTableForm

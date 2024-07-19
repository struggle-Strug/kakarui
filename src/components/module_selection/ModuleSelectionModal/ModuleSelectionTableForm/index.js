/* eslint-disable react/no-array-index-key */
import { useState } from 'react'

import { TriangleIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui'

import { formatDate } from '@/utils/helper'
import { cn } from '@/utils/helper/functions'

const header = {
  name: 'モジュール名',
  tag: 'タグ',
  description: '説明',
  created: '登録日',
  updated: '更新日',
}

const ModuleSelectionTableForm = ({ data }) => {
  const [collapsedId, setCollapsedId] = useState(null)

  const renderHeaderChecked = (
    <div>
      <Checkbox checked />
    </div>
  )

  const renderBodyChecked = (
    <div>
      <Checkbox checked />
    </div>
  )

  const renderCollapseToggle = (rowId) => (
    <div>
      <TriangleIcon
        color="#166CFF"
        className={cn(
          'cursor-pointer transition-transform',
          collapsedId === rowId ? 'rotate-180' : 'rotate-90'
        )}
        onClick={() => setCollapsedId(!collapsedId ? rowId : null)}
      />
    </div>
  )

  const renderTableHead = () =>
    Object.keys(header).map((key) => (
      <th key={key}>
        <div className="flex items-center gap-x-4">
          {key === 'name' && renderHeaderChecked}
          {header[key]}
        </div>
      </th>
    ))

  const renderTableBody = (arr, isChild) =>
    arr.map((row, index) => {
      const hasConfigData = row?.config_data?.length > 0

      return (
        <>
          <tr
            key={index}
            className={cn(
              { 'border-x-0 border-b-0 border-t border-solid border-dark-gray-3': !isChild },
              isChild ? 'py-1' : 'py-3'
            )}
          >
            {Object.keys(header).map((key) => (
              <td key={`${index}-${key}`} className="max-w-[400px]">
                <div className="flex items-center gap-x-4">
                  {key === 'name' && renderBodyChecked}
                  {key === 'created' || key === 'updated' ? formatDate(row[key]) : row[key]}
                  {key === 'name' && hasConfigData && renderCollapseToggle(row?.id)}
                </div>
              </td>
            ))}
          </tr>
          {collapsedId === row?.id && hasConfigData && renderTableBody(row.config_data, true)}
        </>
      )
    })

  return (
    <table className="text-base">
      <thead>
        <tr>{renderTableHead()}</tr>
      </thead>
      <tbody>{renderTableBody(data)}</tbody>
    </table>
  )
}

export default ModuleSelectionTableForm

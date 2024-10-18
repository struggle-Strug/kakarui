import { Handle, Position } from '@xyflow/react'
import { Divider } from 'antd'

import Image from 'next/image'
import { memo, useState } from 'react'

import { Assets } from '@/constants'

// 背景色を`type`に応じて設定
const typeToBgColor = {
  Root: '#413D39',
  Sequence: '#B43F2C',
  Skill: '#E1A23A',
  Decorator: '#4D997D',
  'Sub Tree': '#B36E02',
}

// カスタムノードコンポーネント
const CustomNode = ({ data }) => {
  // Skillノードの場合のみ、siteDataとcustomPropertiesを管理
  const [selectedSiteData, setSelectedSiteData] = useState(
    data.type === 'Skill' && data.siteData ? data.siteData[0] : ''
  )
  const [selectedCustomProperty, setSelectedCustomProperty] = useState(
    data.type === 'Skill' && data.customProperties ? data.customProperties[0] : ''
  )

  const handleSiteDataChange = (event) => {
    setSelectedSiteData(event.target.value)
  }

  const handleCustomPropertyChange = (event) => {
    setSelectedCustomProperty(event.target.value)
  }

  // 背景色を取得
  const bgColor = typeToBgColor[data.type] || '#413D39'

  return (
    <div className="rounded-[13px] bg-white px-2 py-2">
      {/* ノードの内容 */}
      <div className="w-[250px]">
        {/* ノードのターゲットとソースのハンドル */}
        {data.type !== 'Root' && (
          <Handle
            type="source"
            position={Position.Top}
            className="w-24 !border !border-solid !border-[#796E66] !bg-white p-1"
          />
        )}
        <div
          className="flex justify-between w-full px-2 py-2 rounded"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex items-center gap-2">
            {/* モジュールアイコン */}
            {data.image && (
              <Image
                src={data.image}
                className="w-[20px] shrink-0"
                alt="gen3p"
                width={40}
                height={40}
              />
            )}
            <div className="font-bold text-white">{data.type}</div>
          </div>
          {data.type !== 'Root' && <div className="text-white cursor-pointer">×</div>}
        </div>
        {/* Skillノードの詳細情報 */}
        {data.type === 'Skill' && (
          <div className="p-2">
            <div className="flex flex-col gap-2 p-2">
              <div className="text-[14px] font-bold">Name: {data.skillName}</div>
              <div className="text-[14px] font-bold">Type: {data.skillType}</div>{' '}
            </div>
            <Divider className="p-0 my-2" />

            <div className="flex items-center justify-start gap-1">
              <select className="rounded border-2 border-solid border-[#E3E3E4] p-1 text-[14px]">
                {data.siteData &&
                  data.siteData.map((site, index) => (
                    <option key={index} value={site}>
                      {site}
                    </option>
                  ))}
              </select>
              <div className="text-[14px] font-bold">{data.customProperties}</div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1">
                <Image
                  src={Assets.LOWCODEEDITOR.userIcon}
                  className="w-[20px] shrink-0"
                  alt="gen3p"
                  width={20}
                  height={20}
                />
                <div className="truncate text-[14px]">{data.userName}</div>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src={Assets.LOWCODEEDITOR.timeIcon}
                  className="w-[20px] shrink-0"
                  alt="gen3p"
                  width={20}
                  height={20}
                />
                <div className="truncate text-[14px]">{data.updatedAt}</div>
              </div>
            </div>
          </div>
        )}
        {/* Decoratorノードの詳細情報 */}
        {data.type === 'Decorator' && (
          <div className="flex flex-col w-full gap-2 p-2">
            {/* <label>Condition Type: </label> */}
            <select className="w-full rounded-md border-2 border-solid border-[#E3E3E4] p-1">
              {data.conditionalType.map((condition, index) => (
                <option key={index} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            <div>
              <span className="pl-2 text-[14px] font-bold">A</span>
              <select className="ml-4 rounded border-2 border-solid border-[#E3E3E4] p-1">
                {/* Aの値を選択肢として表示 */}
                {data.aValues.map((aValue, index) => (
                  <option key={index} value={aValue}>
                    {aValue}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="pl-2 text-[14px] font-bold">B</span>
              <select className="ml-4 rounded border-2 border-solid border-[#E3E3E4] p-1">
                {/* Bの値を選択肢として表示 */}
                {data.bValues.map((bValue, index) => (
                  <option key={index} value={bValue}>
                    {bValue}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1">
                <Image
                  src={Assets.LOWCODEEDITOR.userIcon}
                  className="w-[20px] shrink-0"
                  alt="gen3p"
                  width={20}
                  height={20}
                />
                <div className="truncate text-[14px]">{data.userName}</div>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src={Assets.LOWCODEEDITOR.timeIcon}
                  className="w-[20px] shrink-0"
                  alt="gen3p"
                  width={20}
                  height={20}
                />
                <div className="truncate text-[14px]">{data.updatedAt}</div>
              </div>
            </div>
          </div>
        )}
        {/* Sub Treeノードの詳細情報 */}
        {data.type === 'Sub Tree' && (
          <div className="flex flex-col gap-2 p-2">
            <div className="text-[14px] font-bold">Name: {data.subTreeName}</div>
            <div className="text-[14px] font-bold">Type: {data.subTreeType}</div>
            <div className="mt-2 text-[14px] font-bold">{data.customProperties}</div>
          </div>
        )}
        <Handle
          type="target"
          position={Position.Bottom}
          className="w-24 !border !border-solid !border-[#796E66] !bg-white p-1"
        />
      </div>
    </div>
  )
}

export default memo(CustomNode)

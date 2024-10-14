import { Divider, Input, Tooltip } from 'antd'

import Image from 'next/image'
import { useState } from 'react'

import { Assets } from '@/constants'

const customProperties = [
  { label: 'Move to', value: 'S01(Position)' },
  { label: 'Move to', value: 'S02(Position)' },
  { label: 'Move to', value: 'S03(Position)' },
  { label: 'Move to', value: 'S04(Position)' },
]
const projectDataKeys = [
  'P01:XXX',
  'P02:XXX',
  'P03:XXX',
  'P05:XXX',
  'P06:XXX',
  'P07:XXX',
  'P08:XXX',
]
const siteDataKeys = ['s01:XXX', 's02:XXX', 's03:XXX', 's04:XXX', 's05:XXX', 's06:XXX', 's07:XXX']

const RightSidebar = () => {
  const seqId = '550e8400-e29b-41d4-a716-43333ddddd'
  // クリップボードにコピーする関数
  const copyToClipboard = () => {
    navigator.clipboard.writeText(seqId).then(() => {
      setVisible(true) // ツールチップを表示
      setTimeout(() => {
        setVisible(false) // 2秒後に非表示
      }, 1000)
    })
  }
  const [name, setName] = useState('Move to 001') // 初期値を設定

  const [visible, setVisible] = useState(false)
  const [properties, setProperties] = useState([
    { label: 'Seq ID', value: seqId, isEditable: false, isCopyable: true },
    { label: 'Name', value: name, isEditable: true, isCopyable: false },
    { label: 'Type', value: 'Skill / Action / Move', isEditable: false, isCopyable: false },
    { label: 'Author', value: '田中義雄', isEditable: false, isCopyable: false },
    { label: 'Publish Date', value: '2024/7/13 13:45', isEditable: false, isCopyable: false },
    { label: 'Update User', value: '羽田美希', isEditable: false, isCopyable: false },
    { label: 'Update Date', value: '2024/9/4 18:22', isEditable: false, isCopyable: false },
  ])

  // 入力が変更された時の処理
  const handleInputChange = (event) => {
    setName(event.target.value) // 入力内容を更新
  }

  return (
    <div className="h-full w-full max-w-[350px] overflow-y-auto bg-white px-4 pb-12 pt-6">
      {/* Data Keys */}
      <div className="w-full">
        <div className="mb-2 text-[16px] font-bold">Data Keys</div>

        {/* Project Data Keys */}
        <div>
          <div className="mb-2 text-[14px] font-bold text-[#796E66]">Project Data Keys</div>
          <div className="pl-6">
            <div>Position: X, Y, Z</div>
            {projectDataKeys.map((key, index) => (
              <div key={index}>{key}</div>
            ))}
          </div>
        </div>

        <Divider className="p-0 my-2" />

        {/* Site Data Keys */}
        <div>
          <div className="mb-2 mt-4 text-[14px] font-bold text-[#796E66]">Site Data Keys</div>
          <div className="pl-6">
            <div>Position: X, Y, Z</div>
            {siteDataKeys.map((key, index) => (
              <div key={index}>{key}</div>
            ))}
          </div>
        </div>
      </div>

      <Divider className="p-0 mt-2 mb-6" />

      {/* Properties View */}
      <div className="w-full">
        <div className="mb-2 text-[16px] font-bold">Properties View</div>
        <div className="my-4 font-bold text-[#796E66]">System Properties</div>

        {/* keyと値の一覧 */}
        <div className="flex flex-col gap-1.5">
          {properties.map((property, index) => (
            <div
              key={index}
              className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]"
            >
              <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">
                {property.label}
              </div>
              <span className="text-[#D3D3D3]">|</span>
              <div className="flex w-2/3 items-center pl-2 text-[13px] text-[#796E66]">
                {property.isEditable ? (
                  <Input
                    type="text"
                    value={property.value}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full border-none bg-white text-[13px]"
                  />
                ) : (
                  <span className="w-full overflow-hidden truncate text-ellipsis">
                    {property.value}
                  </span>
                )}
                {property.isCopyable && (
                  <Tooltip color="black" title="コピーしました" open={visible}>
                    <Image
                      src={Assets.LOWCODEEDITOR.copy}
                      className="mr-1 h-[18px] w-[18px] cursor-pointer"
                      alt=""
                      width={18}
                      height={18}
                      onClick={() => copyToClipboard(property.value)}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider className="p-0 mt-6 mb-6" />

      {/* Custom Properties */}
      <div className="w-full">
        <div className="my-4 font-bold text-[#796E66]">Custom Properties</div>

        {/* keyと値の一覧をループで表示 */}
        <div className="flex flex-col gap-1.5">
          {customProperties.map((property, index) => (
            <div
              key={index}
              className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]"
            >
              <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">
                {property.label}
              </div>
              <span className="text-[#D3D3D3]">|</span>
              <div className="flex pl-2 text-[13px] text-[#796E66]">{property.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default RightSidebar

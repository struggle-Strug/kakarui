import { Divider, Input, Tooltip } from 'antd'

import Image from 'next/image'
import { useState } from 'react'

import { Assets } from '@/constants'

const customProperties = [
  { label: 'Move to', value: 'S01(Position)' },
  { label: 'Move to', value: 'S02(Position)' },
  { label: 'Move to', value: 'S03(Position)' },
  { label: 'Move to', value: 'S04(Position)' },
  { label: 'Move to', value: 'S04(Position)' },
  { label: 'Move to', value: 'S04(Position)' },
  { label: 'Move to', value: 'S04(Position)' },
  { label: 'Move to', value: 'S04(Position)' },
  { label: 'Move to', value: 'S04(Position)' },
  { label: 'Move to', value: 'S04(Position)' },
]
const projectData = [
  { label: '現在位置', value: '120.243.115' },
  { label: 'XXX', value: '10.833.131' },
  { label: 'XXX', value: '843.343.131' },
  { label: 'XXX', value: '1' },
  { label: 'XXX', value: '16' },
  { label: 'XXX', value: '16' },
  { label: 'XXX', value: '16' },
  { label: 'XXX', value: '16' },
  { label: 'XXX', value: '16' },
  { label: 'XXX', value: '16' },
  { label: 'XXX', value: '16' },
  { label: 'XXX', value: '16' },
]
const siteData = [
  { label: 'Nyokkey初期位置', value: '120.243.115' },
  { label: 'タオル位置', value: '10.833.131' },
  { label: '患者位置', value: '843.343.131' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: 'Nyokkey台数', value: '1' },
  { label: '最高速度', value: '16' },
]

// TODO - 後でリファクタ
const title = ''
const DataList = ({ title, data }) => (
  <div>
    <div className="mb-2 text-[14px] font-bold text-[#796E66]">{title}</div>
    <div className="mt-4 pl-1">
      <div className="flex h-[20dvh] flex-col gap-1.5 overflow-y-auto py-2 pr-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4] p-1 text-[12px]"
          >
            <div className="w-2/5 pl-2 font-bold text-[#796E66]">{item.label}</div>
            <span className="text-[#D3D3D3]">|</span>
            <div className="flex w-3/5 text-ellipsis pl-2 text-[#796E66]">
              <span className="w-full overflow-hidden truncate">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
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
    { label: 'Update Date', value: '2024/9/4 18:22', isEditable: false, isCopyable: false },
    { label: 'Update Date', value: '2024/9/4 18:22', isEditable: false, isCopyable: false },
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
        {/* <div className="mb-2 text-[16px] font-bold">Data Keys</div> */}

        {/* Project Data */}
        <DataList title="Project Data" data={projectData} />

        <Divider className="mb-4 mt-8 p-0" />

        {/* Site Data */}
        <DataList title="Site Data" data={siteData} />
      </div>

      <Divider className="mb-4 mt-8 p-0" />

      {/* Properties View */}
      <div className="w-full">
        <div className="mb-2 text-[16px] font-bold">Properties View</div>
        <div className="my-4 text-[14px] font-bold text-[#796E66]">System Properties</div>

        {/* keyと値の一覧 */}
        <div className="flex h-[23dvh] flex-col gap-1.5 overflow-y-auto py-2 pr-3">
          {properties.map((property, index) => (
            <div
              key={index}
              className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4] p-1 text-[12px]"
            >
              <div className="w-2/5 pl-2 font-bold text-[#796E66]">{property.label}</div>
              <span className="text-[#D3D3D3]">|</span>
              <div className="flex w-3/5 items-center pl-2 text-[#796E66]">
                {property.isEditable ? (
                  <Input
                    type="text"
                    value={property.value}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full border-none bg-white p-0"
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

      <Divider className="mb-4 mt-8 p-0" />

      {/* Custom Properties */}
      <DataList title="Custom Properties" data={customProperties} />
    </div>
  )
}
export default RightSidebar

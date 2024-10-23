import { Divider, Input, Tooltip } from 'antd'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { API, Assets } from '@/constants'
import { useOrganizationQuery } from '@/hooks/query'

import { uuidv4 } from '@/utils/helper/functions'
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'

import { mockProjectData } from './mockData/mockProjectsData'
import { mockSiteData } from './mockData/mockSiteData'

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
            <div className="scrollbar-hide w-2/5  overflow-x-auto whitespace-nowrap pl-2 font-bold text-[#796E66]">
              {item.label}
            </div>
            <span className="text-[#D3D3D3]">|</span>
            <div className="flex w-3/5 overflow-hidden text-ellipsis whitespace-nowrap pl-2 text-[#796E66]">
              <span className="w-full overflow-hidden text-ellipsis">{item.value}</span>

            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const RightSidebar = ({ skillId, skills }) => {
  const { organizationId } = useOrganizationQuery()
  const [projectData, setProjectData] = useState([]) // APIから取得したプロジェクトデータを保存
  const [siteData, setSiteData] = useState([]) // APIから取得したサイトデータを保存
  const [systemProperty, setsystemProperty] = useState([]) // APIから取得したサイトデータを保存
  const [loading, setLoading] = useState(true) // ローディング状態を管理
  const [error, setError] = useState(null) // エラーメッセージを保存

  //TODO - projectIdを特定してセットする
  const projectId = '9dcec428-e9bc-4a6c-80d4-f432d1fa677d'
  const siteId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  const moduleConfigId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

  // API呼び出しの関数
  const fetchProjectData = async () => {
    try {
      const response = await Axios.get(
        buildApiURL(API.PROJECT_DATA.LIST, {
          organization_id: organizationId,
          project_id: projectId,
        })
      )
      console.log('response', response.data)

      let data = response.data.datas
      if (data.length === 0) {
        data = mockProjectData.datas
      }
      setProjectData(
        data.map((item) => ({
          label: item.key,
          value: item.value,
        }))
      )
    } catch (error) {
      console.error('Error fetching project data:', error)
      setError('Failed to fetch project data.')
      setProjectData(
        mockProjectData.datas.map((item) => ({
          label: item.key,
          value: item.value,
        }))
      )
    } finally {
      setLoading(false)
    }
  }

  // Site Dataのフェッチ関数
  const fetchSiteData = async () => {
    try {
      const response = await Axios.get(
        buildApiURL(API.SITE_DATA.LIST, {
          site_id: siteId,
        })
      )
      console.log('Site Data response', response.data)

      let data = response.data.site_data
      if (data.length === 0) {
        data = mockSiteData.site_data
      }
      setSiteData(
        data.map((item) => ({
          label: item.key,
          value: Array.isArray(item.value) ? item.value.join(', ') : item.value, // 配列ならカンマで結合
        }))
      )
    } catch (error) {
      console.error('Error fetching site data:', error)
      setError('Failed to fetch site data.')
      setSiteData(
        mockSiteData.site_data.map((item) => ({
          label: item.key,
          value: Array.isArray(item.value) ? item.value.join(', ') : item.value, // 配列ならカンマで結合
        }))
      )
    }
  }

  // System Propertiesのフェッチ関数
  const fetchSystemProperty = async () => {
    try {
      const response = await Axios.get(
        buildApiURL(API.SKILL.LIST, {
          organization_id: organizationId,
        })
      )
      console.log('response', response.data)

      let data = response.data.datas
      if (data.length === 0) {
        throw new Error('No data available');
      }
      setsystemProperty(
        data.map((item) => ({
          label: item.key,
          value: item.value,
        }))
      )
    } catch (error) {
      console.error('Error fetching system properties:', error)
      setError('Failed to fetch system properties.')
    } finally {
      setLoading(false)
    }
  }

  const propertyLabelsMap = {
    id: 'Seq ID',
    name: 'Name',
    schema: 'Type',
    create_user_name: 'Author',
    create_date: 'Publish Date',
    update_user_name: 'Update User',
    update_date: 'Update Date',
  };

  const filteredSystemProperties = systemProperty.filter((property) =>
    Object.keys(propertyLabelsMap).includes(property.label)
  );

  // コンポーネントがマウントされた時にAPIを呼び出す
  useEffect(() => {
    if (organizationId) {
      fetchProjectData()
      fetchSiteData() // Site Dataのフェッチを追加
      fetchSystemProperty() // System Propertiesのフェッチを追加
    }
  }, [organizationId])

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

  const [seqId, setSeqId] = useState('')

  const [properties, setProperties] = useState([
    { label: 'Seq ID', value: '', isEditable: false, isCopyable: true }, // 初期値は空に
    { label: 'Name', value: name, isEditable: true, isCopyable: false },
    { label: 'Type', value: 'Skill / Action / Move', isEditable: false, isCopyable: false },
    { label: 'Author', value: '田中義雄', isEditable: false, isCopyable: false },
    { label: 'Publish Date', value: '2024/7/13 13:45', isEditable: false, isCopyable: false },
    { label: 'Update User', value: '羽田美希', isEditable: false, isCopyable: false },
    { label: 'Update Date', value: '2024/9/4 18:22', isEditable: false, isCopyable: false },
  ])

  // クライアントサイドでのみUUIDを生成し、状態を更新
  useEffect(() => {
    const newSeqId = uuidv4()
    setSeqId(newSeqId)
    setProperties((prevProperties) =>
      prevProperties.map((prop) => (prop.label === 'Seq ID' ? { ...prop, value: newSeqId } : prop))
    )
  }, [])

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
          {filteredSystemProperties.map((property, index) => (
            <div
              key={index}
              className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4] p-1 text-[12px]"
            >
              <div className="scrollbar-hide w-2/5 overflow-x-auto whitespace-nowrap pl-2 font-bold text-[#796E66]">
                {propertyLabelsMap[property.label]}
              </div>
              <span className="text-[#D3D3D3]">|</span>
              <div className="flex w-3/5 items-center pl-2 text-[#796E66]">
                {property.isEditable ? (
                  <Input
                    type="text"
                    value={property.value}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full border-none bg-white px-1 py-0"
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

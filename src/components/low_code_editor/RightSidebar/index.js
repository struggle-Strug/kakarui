import { Divider, Input, Tooltip } from 'antd'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { API, Assets } from '@/constants'
import { useOrganizationQuery } from '@/hooks/query'
import { useProjectActive } from '@/hooks/query/project/index'
import { useSiteDataQuery } from "@/hooks/query/sitedatakey";

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
  const { projectActiveId } = useProjectActive()
  const { siteNames } = useSiteDataQuery()
  const [projectData, setProjectData] = useState([]) // APIから取得したプロジェクトデータを保存
  const [siteData, setSiteData] = useState([]) // APIから取得したサイトデータを保存
  const [loading, setLoading] = useState(true) // ローディング状態を管理
  const [error, setError] = useState(null) // エラーメッセージを保存
  const [filteredSystemProperties, setFilteredSystemProperties] = useState([])

  useEffect(() => {
    if (skills && skillId !== "") {
      const filteredValue = skills.filter((item) => item.id === skillId);
      setFilteredSystemProperties(filteredValue);
    }
  }, [skillId, skills])

  useEffect(() => {
    console.log("filteredSystemProperties", filteredSystemProperties);
  }, [filteredSystemProperties])

  // API呼び出しの関数
  const fetchProjectData = async () => {
    try {
      const response = await Axios.get(
        buildApiURL(API.PROJECT_DATA.LIST, {
          organization_id: organizationId,
          project_id: projectActiveId,
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
          site_id: siteNames.id,
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

  // System Properties
  const systemProperties = [
    { label: 'Seq ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Author', key: 'create_user_name' },
    { label: 'Publish Date', key: 'create_date' },
    { label: 'Update User', key: 'update_user_name' },
    { label: 'Update Date', key: 'update_date' },
  ];

  // コンポーネントがマウントされた時にAPIを呼び出す
  useEffect(() => {
    if (organizationId) {
      fetchProjectData()
      fetchSiteData() // Site Dataのフェッチを追加
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

  // const [properties, setProperties] = useState([
  //   { label: 'Seq ID', value: '', isEditable: false, isCopyable: true }, // 初期値は空に
  //   { label: 'Name', value: name, isEditable: true, isCopyable: false },
  //   { label: 'Type', value: 'Skill / Action / Move', isEditable: false, isCopyable: false },
  //   { label: 'Author', value: '田中義雄', isEditable: false, isCopyable: false },
  //   { label: 'Publish Date', value: '2024/7/13 13:45', isEditable: false, isCopyable: false },
  //   { label: 'Update User', value: '羽田美希', isEditable: false, isCopyable: false },
  //   { label: 'Update Date', value: '2024/9/4 18:22', isEditable: false, isCopyable: false },
  // ])

  // // クライアントサイドでのみUUIDを生成し、状態を更新
  // useEffect(() => {
  //   const newSeqId = uuidv4()
  //   setSeqId(newSeqId)
  //   setProperties((prevProperties) =>
  //     prevProperties.map((prop) => (prop.label === 'Seq ID' ? { ...prop, value: newSeqId } : prop))
  //   )
  // }, [])

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
          {systemProperties.map((property, index) => (
            <div
              key={index}
              className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4] p-1 text-[12px]"
            >
              <div className="scrollbar-hide w-2/5 overflow-x-auto whitespace-nowrap pl-2 font-bold text-[#796E66]">
                {property.label}
              </div>
              <span className="text-[#D3D3D3]">|</span>
              <div className="flex w-3/5 items-center pl-2 text-[#796E66]">
                {filteredSystemProperties.isEditable ? (
                  <Input
                    type="text"
                    value={filteredSystemProperties[0]?.[property.key]}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full border-none bg-white px-1 py-0"
                  />
                ) : (
                  <span className="w-full overflow-hidden truncate text-ellipsis">
                    {filteredSystemProperties[0]?.[property.key]}
                  </span>
                )}
                {property.label === 'Seq ID' && filteredSystemProperties[0]?.id && (
                  <Tooltip color="black" title="コピーしました" open={visible}>
                    <Image
                      src={Assets.LOWCODEEDITOR.copy}
                      className="mr-1 h-[18px] w-[18px] cursor-pointer"
                      alt=""
                      width={18}
                      height={18}
                      onClick={() => copyToClipboard(filteredSystemProperties[0]?.id)}
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

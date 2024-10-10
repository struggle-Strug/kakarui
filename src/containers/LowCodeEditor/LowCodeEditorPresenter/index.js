import { ReactFlowProvider } from '@xyflow/react'
import { Divider, Input, Tooltip } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Assets } from '@/constants'
import { useModuleConfigQuery } from '@/hooks/query'

import { getSearchOptions } from '@/utils/helper/functions'

import Header from '../Header'
import Flow from '../Sequence'
import Sidebar from '../Sidebar'

// ロジックはLowCodeEditorContainerから受け取る。ここはUIのみ。
export const LowCodeEditorPresenter = () => {
  const router = useRouter()

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching } = useModuleConfigQuery({
    sort,
    search,
  })
  const [open, setOpen] = useState(true)

  // ボタンのクリックでDrawerの開閉をトグル
  const toggleDrawer = () => {
    setOpen(!open)
  }
  const searchOptions = getSearchOptions(data, ['name'])

  const seqId = '550e8400-e29b-41d4-a716-43333ddddd'
  const [visible, setVisible] = useState(false)

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

  // 入力が変更された時の処理
  const handleInputChange = (event) => {
    setName(event.target.value) // 入力内容を更新
  }

  return (
    <div className="h-screen overflow-clip">
      {/* SECTION - ヘッダー */}
      <Header />

      <div className="flex h-[95%] w-full justify-between">
        <ReactFlowProvider>
          {/* SECTION - 左サイドバー */}
          {/* TODO - 横幅固定にしているのでmax widthにするか検討 */}
          <Sidebar />

          {/* SECTION - シーケンス */}
          <div className="w-full bg-[#E4E4E4]">
            <Flow />
          </div>
        </ReactFlowProvider>

        {/* SECTION - drawer/ドロワー */}
        <div className="flex h-full items-center justify-center bg-[#E4E4E4]">
          <div
            className=" mb-8 flex h-[120px] w-[26px]  cursor-pointer items-center justify-center rounded-l-3xl bg-white"
            onClick={toggleDrawer}
          >
            <Image
              src={open ? Assets.LOWCODEEDITOR.arrowRight : Assets.LOWCODEEDITOR.arrowLeft}
              className="h-[18px] w-[18px]"
              alt=""
              width={18}
              height={18}
            />
          </div>
        </div>

        {/* SECTION - 右サイドバー */}

        {open && (
          <div className="h-full w-full max-w-[350px] overflow-y-auto bg-white px-4 pb-12 pt-6">
            {/* Data Keys */}
            <div className="w-full">
              <div className="mb-2 text-[16px] font-bold">Data Keys</div>

              {/* Project Data Keys */}
              <div>
                <div className="mb-2 text-[14px] font-bold text-[#796E66]">Project Data Keys</div>
                <div className="pl-6">
                  <div>Position:X,Y,Z</div>
                  <div>P01:XXX</div>
                  <div>P02:XXX</div>
                  <div>P03:XXX</div>
                  <div>P05:XXX</div>
                  <div>P06:XXX</div>
                  <div>P07:XXX</div>
                  <div>P08:XXX</div>
                </div>
              </div>

              <Divider className="p-0 my-2" />

              {/* Project Data Keys */}
              <div>
                <div className="mb-2 mt-4 text-[14px] font-bold text-[#796E66]">Site Data Keys</div>
                <div className="pl-6">
                  <div>Position:X,Y,Z</div>
                  <div>s01:XXX</div>
                  <div>s02:XXX</div>
                  <div>s03:XXX</div>
                  <div>s04:XXX</div>
                  <div>s05:XXX</div>
                  <div>s06:XXX</div>
                  <div>s07:XXX</div>
                </div>
              </div>
            </div>

            <Divider className="p-0 mt-2 mb-6" />

            {/* Properties View */}
            <div className="w-full ">
              <div className="mb-2 text-[16px] font-bold">Properties View</div>
              <div className="my-4 font-bold text-[#796E66]">System Properties</div>
              {/* keyと値の一覧 */}
              <div className="flex flex-col gap-1.5">
                {/* seq ID */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4] px-2">
                  <div className="w-1/3 text-[13px] font-bold text-[#796E66]">Seq ID</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex w-2/3 items-center pl-2  text-[13px] text-[#796E66]">
                    <span className="w-full overflow-hidden truncate text-ellipsis">{seqId}</span>

                    <Tooltip color="black" title="コピーしました" open={visible}>
                      <Image
                        src={Assets.LOWCODEEDITOR.copy}
                        className="h-[18px] w-[18px] cursor-pointer"
                        alt=""
                        width={18}
                        height={18}
                        onClick={copyToClipboard}
                      />
                    </Tooltip>
                  </div>
                </div>
                {/* name */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Name</div>
                  <span className="text-[#D3D3D3]">|</span>
                  {/* <div className="flex pl-2 text-[13px] text-[#796E66]">Move to 001</div> */}
                  <Input
                    type="text"
                    value={name}
                    onChange={handleInputChange}
                    className="w-2/3 border-none bg-white pl-2 text-[13px]"
                  />
                </div>
                {/* type */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Type</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">Skill / Action / Move</div>
                </div>
                {/* Author */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Author</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">田中義雄</div>
                </div>
                {/* Publish Date */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">
                    Publish Date
                  </div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">2024/7/13 13:45</div>
                </div>
                {/* Update User */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Update User</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">羽田美希</div>
                </div>
                {/* Update Date */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Update Date</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">2024/9/4 18:22</div>
                </div>
              </div>
            </div>

            <Divider className="p-0 mt-6 mb-6" />

            {/* Custom Properties */}
            <div className="w-full">
              <div className="mb-2 text-[16px] font-bold">Custom Properties</div>
              {/* keyと値の一覧 */}
              <div className="flex flex-col gap-1.5">
                {/* seq ID */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Move to</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">S01(Position)</div>
                </div>
                {/* seq ID */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Move to</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">S01(Position)</div>
                </div>
                {/* seq ID */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Move to</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">S01(Position)</div>
                </div>
                {/* seq ID */}
                <div className="flex items-center rounded border border-solid border-[#D3D3D3] bg-[#F4F4F4]">
                  <div className="w-1/3 pl-2 text-[13px] font-bold text-[#796E66]">Move to</div>
                  <span className="text-[#D3D3D3]">|</span>
                  <div className="flex pl-2 text-[13px] text-[#796E66]">S01(Position)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

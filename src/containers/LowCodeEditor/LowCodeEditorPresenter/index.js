import { Divider, Input, Tooltip } from 'antd'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Assets } from '@/constants'
import { useModuleConfigQuery } from '@/hooks/query'

import { Button } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

import FlowField from '../Sequence'

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
    <div className="h-screen">
      {/* SECTION - ヘッダー */}
      <div className="text-wh1te flex h-[5%] min-h-[60px] w-full items-center justify-between !bg-[#413D39] bg-black px-6 py-2">
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center">
            <Image
              src={Assets.LOWCODEEDITOR.logo}
              className="shrink-0"
              alt="gen3p"
              width={200}
              height={90}
            />
          </div>
          <div className="text-[16px] font-[600px]">Technical Preview版</div>
        </div>
        <div className="flex gap-4 text-white">
          <Button className="!rounded !border-2 !border-white !bg-black !px-6 !text-[14px] !font-bold text-black">
            Import
          </Button>
          <Button className="!rounded border !bg-white !px-8 !text-[14px] !font-bold !text-black">
            Save
          </Button>
        </div>
      </div>

      <div className="flex h-[95%] w-full justify-between">
        {/* SECTION - 左サイドバー */}
        {/* TODO - 横幅固定にしているのでmax widthにするか検討 */}
        <div className="w-[350px] bg-[#F4F4F4]">
          {/* Selectorからスキル名検索 */}
          <div className="px-3 py-5 bg-white">
            {/* 3つのモジュールアイコン */}
            <div className="flex gap-2">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="">
                  <Image
                    src={Assets.LOWCODEEDITOR.selector}
                    className="h-[80px] w-[76px] shrink-0 "
                    alt="gen3p"
                    width={18}
                    height={18}
                  />
                </div>
                <div className="text-[11px] font-bold text-[#796E66]">Selector</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <Image
                  src={Assets.LOWCODEEDITOR.sequence}
                  className="h-[80px] w-[76px] shrink-0 "
                  alt="gen3p"
                  width={18}
                  height={18}
                />
                <div className="text-[11px] font-bold text-[#796E66]">Sequence</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <Image
                  src={Assets.LOWCODEEDITOR.decorator}
                  className="h-[80px] w-[76px] shrink-0 "
                  alt="gen3p"
                  width={18}
                  height={18}
                />
                <div className="text-[11px] font-bold text-[#796E66]">Decorator</div>
              </div>
            </div>

            <div>
              <Divider className="p-0 my-3" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="mt-3 flex items-center gap-1.5">
                <Image
                  src={Assets.LOWCODEEDITOR.skillsSubTree}
                  className="shrink-0"
                  alt="gen3p"
                  width={24}
                  height={24}
                />
                <div className="text-[14px] font-bold text-[#796E66]">Skills / SubTree</div>
              </div>
              <div>
                <Input
                  size=""
                  placeholder="スキル名・説明"
                  className="border border-solid border-[#E3E3E4]"
                  color="red"
                  prefix={
                    <Image
                      src={Assets.LOWCODEEDITOR.search}
                      className="shrink-0"
                      alt="gen3p"
                      width={18}
                      height={18}
                    />
                  }
                  suffix={
                    <Image
                      src={Assets.LOWCODEEDITOR.closed}
                      className="shrink-0"
                      alt="gen3p"
                      width={12}
                      height={12}
                    />
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 px-4 py-6 overflow-y-auto h-3/4">
            {/* Sensor / Temperature */}
            <div>
              <div className="flex items-start gap-1 mb-3">
                <Image
                  src={Assets.LOWCODEEDITOR.caretDown}
                  className="shrink-0"
                  alt="gen3p"
                  width={14}
                  height={14}
                />

                <div className="font-[#796E66] text-[11px] font-bold">Sensor / Temperature</div>
              </div>
              {/* カード一覧 */}
              <div className="pl-2">
                <div className="rounded-md border-2 border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1">
                  <div className="flex w-[230px] items-center gap-2">
                    <Image
                      src={Assets.LOWCODEEDITOR.dragDot}
                      className="h-[14px]"
                      alt=""
                      width={14}
                      height={4}
                    />
                    <div>
                      {/* スキルアイコンとタイトル */}
                      <div className="flex items-center">
                        <Image
                          src={Assets.LOWCODEEDITOR.skillsIcon}
                          className="h-[18px]"
                          alt=""
                          width={18}
                          height={4}
                        />
                        <div className="!text-[12px] font-bold text-[#796E66]">
                          気温を取得し、P01にセット
                        </div>
                      </div>
                      <div className="pl-4 text-[12px] text-[#796E66]">
                        搭載センサーから気温を取得してProject Data KeysのP01にセットする。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Utility / Get Information */}
            <div>
              <div className="flex items-start gap-1 mb-3">
                <Image
                  src={Assets.LOWCODEEDITOR.caretRight}
                  className="shrink-0"
                  alt="gen3p"
                  width={14}
                  height={14}
                />

                <div className="font-[#796E66] text-[11px] font-bold">
                  Utility / Get Information
                </div>
              </div>
              {/* カード一覧 */}
              <div className="flex flex-col gap-2">
                {/* カード1 */}
                <div className="pl-2">
                  <div className="rounded-md border-2 border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1">
                    <div className="flex w-[230px] items-center gap-2">
                      <Image
                        src={Assets.LOWCODEEDITOR.dragDot}
                        className="h-[14px]"
                        alt=""
                        width={14}
                        height={4}
                      />
                      <div>
                        {/* スキルアイコンとタイトル */}
                        <div className="flex items-center">
                          <Image
                            src={Assets.LOWCODEEDITOR.skillsIcon}
                            className="h-[18px]"
                            alt=""
                            width={18}
                            height={4}
                          />
                          <div className="!text-[12px] font-bold text-[#796E66]">
                            気温を取得し、P01にセット
                          </div>
                        </div>
                        <div className="pl-4 text-[12px] text-[#796E66]">
                          搭載センサーから気温を取得してProject Data KeysのP01にセットする。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* カード2 */}
                <div className="pl-2">
                  <div className="rounded-md border-2 border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1">
                    <div className="flex w-[230px] items-center gap-2">
                      <Image
                        src={Assets.LOWCODEEDITOR.dragDot}
                        className="h-[14px]"
                        alt=""
                        width={14}
                        height={4}
                      />
                      <div>
                        {/* スキルアイコンとタイトル */}
                        <div className="flex items-center">
                          <Image
                            src={Assets.LOWCODEEDITOR.skillsIcon}
                            className="h-[18px]"
                            alt=""
                            width={18}
                            height={4}
                          />
                          <div className="!text-[12px] font-bold text-[#796E66]">
                            気温を取得し、P01にセット
                          </div>
                        </div>
                        <div className="pl-4 text-[12px] text-[#796E66]">
                          搭載センサーから気温を取得してProject Data KeysのP01にセットする。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* カード3 */}
                <div className="pl-2">
                  <div className="rounded-md border-2 border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1">
                    <div className="flex w-[230px] items-center gap-2">
                      <Image
                        src={Assets.LOWCODEEDITOR.dragDot}
                        className="h-[14px]"
                        alt=""
                        width={14}
                        height={4}
                      />
                      <div>
                        {/* スキルアイコンとタイトル */}
                        <div className="flex items-center">
                          <Image
                            src={Assets.LOWCODEEDITOR.skillsIcon}
                            className="h-[18px]"
                            alt=""
                            width={18}
                            height={4}
                          />
                          <div className="!text-[12px] font-bold text-[#796E66]">
                            気温を取得し、P01にセット
                          </div>
                        </div>
                        <div className="pl-4 text-[12px] text-[#796E66]">
                          搭載センサーから気温を取得してProject Data KeysのP01にセットする。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* カード4 */}
                <div className="pl-2">
                  <div className="rounded-md border-2 border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1">
                    <div className="flex w-[230px] items-center gap-2">
                      <Image
                        src={Assets.LOWCODEEDITOR.dragDot}
                        className="h-[14px]"
                        alt=""
                        width={14}
                        height={4}
                      />
                      <div>
                        {/* スキルアイコンとタイトル */}
                        <div className="flex items-center">
                          <Image
                            src={Assets.LOWCODEEDITOR.skillsIcon}
                            className="h-[18px]"
                            alt=""
                            width={18}
                            height={4}
                          />
                          <div className="!text-[12px] font-bold text-[#796E66]">
                            気温を取得し、P01にセット
                          </div>
                        </div>
                        <div className="pl-4 text-[12px] text-[#796E66]">
                          搭載センサーから気温を取得してProject Data KeysのP01にセットする。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* カード4 */}
                <div className="pl-2">
                  <div className="rounded-md border-2 border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1">
                    <div className="flex w-[230px] items-center gap-2">
                      <Image
                        src={Assets.LOWCODEEDITOR.dragDot}
                        className="h-[14px]"
                        alt=""
                        width={14}
                        height={4}
                      />
                      <div>
                        {/* スキルアイコンとタイトル */}
                        <div className="flex items-center">
                          <Image
                            src={Assets.LOWCODEEDITOR.skillsIcon}
                            className="h-[18px]"
                            alt=""
                            width={18}
                            height={4}
                          />
                          <div className="!text-[12px] font-bold text-[#796E66]">
                            気温を取得し、P01にセット
                          </div>
                        </div>
                        <div className="pl-4 text-[12px] text-[#796E66]">
                          搭載センサーから気温を取得してProject Data KeysのP01にセットする。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* カード4 */}
                <div className="pl-2">
                  <div className="rounded-md border-2 border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1">
                    <div className="flex w-[230px] items-center gap-2">
                      <Image
                        src={Assets.LOWCODEEDITOR.dragDot}
                        className="h-[14px]"
                        alt=""
                        width={14}
                        height={4}
                      />
                      <div>
                        {/* スキルアイコンとタイトル */}
                        <div className="flex items-center">
                          <Image
                            src={Assets.LOWCODEEDITOR.skillsIcon}
                            className="h-[18px]"
                            alt=""
                            width={18}
                            height={4}
                          />
                          <div className="!text-[12px] font-bold text-[#796E66]">
                            気温を取得し、P01にセット
                          </div>
                        </div>
                        <div className="pl-4 text-[12px] text-[#796E66]">
                          搭載センサーから気温を取得してProject Data KeysのP01にセットする。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION - シーケンス */}
        <div className="w-full bg-[#E4E4E4]">
          <FlowField />
        </div>

        {/* SECTION - drawer/ドロワー */}
        <div
          className="flex h-full cursor-pointer items-center justify-center overflow-y-auto bg-[#E4E4E4]"
          onClick={toggleDrawer}
        >
          <div className="mb-8 flex h-[120px] w-[26px] items-center justify-center rounded-l-3xl bg-white">
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
          <div className="h-full w-full max-w-[350px] overflow-y-auto bg-white px-4 py-6">
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

                    <Tooltip color="black" title="コピーしました" visible={visible}>
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

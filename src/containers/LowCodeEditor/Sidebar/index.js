import { Divider, Input } from 'antd'

import Image from 'next/image'

import { Assets } from '@/constants'

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
  return (
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
          {/* sequence */}
          <div className="flex flex-col items-center justify-center gap-1">
            <Image
              src={Assets.LOWCODEEDITOR.sequence}
              className="h-[80px] w-[76px] shrink-0 cursor-grab"
              alt="gen3p"
              width={18}
              height={18}
              draggable
              onDragStart={(event) => onDragStart(event, 'Sequence')}
            />
            <div className="text-[11px] font-bold text-[#796E66]">Sequence</div>
          </div>
          {/* decorator */}
          <div className="flex flex-col items-center justify-center gap-1">
            <Image
              src={Assets.LOWCODEEDITOR.decorator}
              className="h-[80px] w-[76px] shrink-0 cursor-grab"
              alt="gen3p"
              width={18}
              height={18}
              draggable
              onDragStart={(event) => onDragStart(event, 'Decorator')}
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

      <div className="flex flex-col gap-6 px-4 py-6 overflow-y-auto h-4/5">
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
          <div className="flex items-start gap-1 mb-4">
            <Image
              src={Assets.LOWCODEEDITOR.caretRight}
              className="shrink-0"
              alt="gen3p"
              width={14}
              height={14}
            />

            <div className="font-[#796E66] text-[11px] font-bold">Utility / Get Information</div>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

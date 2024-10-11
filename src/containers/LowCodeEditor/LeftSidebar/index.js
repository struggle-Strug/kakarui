import Image from 'next/image'
import { useState } from 'react'

import { Assets } from '@/constants'

import ModulesSelector from '../ModulesSelector/index'

const LeftSidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const [cards, setCards] = useState([
    {
      id: 1,
      title: '気温を取得し、P01にセット',
      description: '搭載センサーから気温を取得してProject Data KeysのP01にセットする。',
    },
    {
      id: 2,
      title: '湿度を取得し、P02にセット',
      description: '搭載センサーから湿度を取得してProject Data KeysのP02にセットする。',
    },
    {
      id: 3,
      title: '気圧を取得し、P03にセット',
      description: '搭載センサーから気圧を取得してProject Data KeysのP03にセットする。',
    },
    {
      id: 3,
      title: '気圧を取得し、P03にセット',
      description: '搭載センサーから気圧を取得してProject Data KeysのP03にセットする。',
    },
  ])
  return (
    <div className="h-full w-full max-w-[300px] bg-[#F4F4F4]">
      {/* Selectorからスキル名検索 */}
      <ModulesSelector />
      <div className="flex h-[calc(100%-250px)] w-full flex-col gap-6 overflow-y-auto px-4 py-6">
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
            <div className="rounded-md border border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1">
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
        <div className="flex flex-col h-full">
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
          <div className="flex flex-col gap-2 pb-6">
            {cards.map((card) => (
              <div key={card.id} className="pl-2">
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
                        <div className="!text-[12px] font-bold text-[#796E66]">{card.title}</div>
                      </div>
                      <div className="pl-4 text-[12px] text-[#796E66]">{card.description}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar

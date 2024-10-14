import Image from 'next/image'
import { useState } from 'react'

import { Assets } from '@/constants'

import ModulesSelector from './ModulesSelector/index'
import { initialSections } from './skillData'

const LeftSidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const [sections, setSections] = useState(initialSections)
  // セクションの開閉をトグルする関数
  const toggleSection = (type) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.type === type
          ? { ...section, isOpen: !section.isOpen } // クリックされたセクションの開閉状態を反転
          : section
      )
    )
  }

  const [filteredSections, setFilteredSections] = useState(initialSections)
  // フィルタリング関数
  const handleFilter = (keyword) => {
    if (!keyword) {
      setFilteredSections(sections) // キーワードが空の場合は全てのセクションを表示
    } else {
      const filtered = sections
        .map((section) => ({
          ...section,
          cards: section.cards.filter(
            (card) => card.title.includes(keyword) || card.description.includes(keyword)
          ),
        }))
        .filter((section) => section.cards.length > 0) // カードが存在するセクションのみ表示
      setFilteredSections(filtered)
    }
  }
  return (
    <div className="h-full w-full max-w-[300px] bg-[#F4F4F4]">
      {/* Selectorからスキル名検索 */}
      <ModulesSelector onDragStart={onDragStart} onFilter={handleFilter} />
      <div className="flex h-[calc(100%-250px)] w-full flex-col gap-6 overflow-y-auto px-4 py-6">
        <div className="h-full">
          {filteredSections.map((section) => (
            <div key={section.type} className="mb-6">
              {/* セクションのタイトルとトグルアイコン */}
              <div
                className="mb-3 flex cursor-pointer items-start gap-1"
                onClick={() => toggleSection(section.type)}
              >
                <Image
                  src={
                    section.isOpen
                      ? Assets.LOWCODEEDITOR.caretDown // 開いている場合は下向き矢印
                      : Assets.LOWCODEEDITOR.caretRight // 閉じている場合は右向き矢印
                  }
                  className="shrink-0"
                  alt={section.type}
                  width={14}
                  height={14}
                />
                <div className="font-[#796E66] text-[11px] font-bold">{section.type}</div>
              </div>
              {/* セクション内のカードリスト（トグルで表示/非表示を切り替える） */}
              <div className={`pl-2 ${section.isOpen ? '' : 'hidden'}`}>
                {section.cards.map((card) => (
                  <div
                    key={card.id}
                    className="mb-2 rounded-md border border-solid border-[#E3E3E4] bg-white py-2 pl-2 pr-1"
                  >
                    <div className="flex w-[230px] items-center gap-2">
                      <Image
                        src={Assets.LOWCODEEDITOR.dragDot}
                        className="h-[14px]"
                        alt=""
                        width={14}
                        height={4}
                      />
                      <div>
                        <div className="flex items-center">
                          <Image
                            src={card.icon}
                            className="h-[18px]"
                            alt=""
                            width={18}
                            height={18}
                          />
                          <div className="text-[12px] font-bold text-[#796E66]">{card.title}</div>
                        </div>
                        <div className="pl-4 text-[12px] text-[#796E66]">{card.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar

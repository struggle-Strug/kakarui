import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Assets } from '@/constants'

import ModulesSelector from './ModulesSelector/index'

// スキルをタグごとにグルーピングする関数
const groupSkillsByTag = (skills) => {
  return skills.reduce((acc, skill) => {
    const tag = skill.tag || 'unknown'
    if (!acc[tag]) {
      acc[tag] = []
    }
    acc[tag].push(skill)
    return acc
  }, {})
}
const LeftSidebar = ({ skills, setDraggedNodeType }) => {
  const groupedSkills = groupSkillsByTag(skills)

  // ドラッグ開始時にノードタイプを状態に保存
  const onDragStart = (event, nodeType, skillId) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData(
      'skillData',
      JSON.stringify(skills.find((skill) => skill.id === skillId))
    ) // スキルデータも渡す
    event.dataTransfer.effectAllowed = 'move'
    setDraggedNodeType(nodeType) // ドラッグされたノードタイプを保存
  }
  // グループ化されたスキルをセクション形式に変換
  const initialSections = Object.keys(groupedSkills).map((tag) => ({
    type: tag,
    isOpen: true, // 初期状態では全てのセクションを開いておく
    cards: groupedSkills[tag].map((skill) => ({
      id: skill.id,
      title: skill.name, // スキルの名前を使用
      description: skill.description, // スキルの説明を使用
      icon: Assets.LOWCODEEDITOR.skillsIcon, // アイコンはデフォルトを使用（変更可能）
    })),
  }))

  const [sections, setSections] = useState(initialSections)
  const [filteredSections, setFilteredSections] = useState(initialSections)

  // セクションの開閉をトグルする関数
  const toggleSection = (type) => {
    setFilteredSections((prevSections) =>
      prevSections.map((section) =>
        section.type === type
          ? { ...section, isOpen: !section.isOpen } // クリックされたセクションの開閉状態を反転
          : section
      )
    )
  }

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

  useEffect(() => {
    setSections(initialSections)
    setFilteredSections(initialSections)
  }, [skills]) // `skills` が更新されたらセクションも更新
  return (
    <div className="h-full w-full max-w-[300px] bg-[#F4F4F4]">
      {/* Selectorからスキル名検索 */}
      <ModulesSelector onDragStart={onDragStart} onFilter={handleFilter} />
      <div className="flex h-[calc(100%-250px)] w-full flex-col gap-6 overflow-y-auto px-4 py-4">
        <div className="h-full">
          {filteredSections.map((section) => (
            <div key={section.type} className="mb-4">
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
                <div
                  className="truncate font-[#796E66] text-[11px] font-bold"
                  style={{ maxWidth: '180px' }} // テキストの長さ制限
                >
                  {section.type} {/* タグ名 */}
                </div>
              </div>
              {/* セクション内のカードリスト（トグルで表示/非表示を切り替える） */}
              <div className={`pl-2 ${section.isOpen ? '' : 'hidden'}`}>
                {section.cards.map((card) => (
                  <div
                    key={card.id}
                    className="mb-2 rounded-md border border-solid border-[#E3E3E4] bg-white py-3 pl-2 pr-1"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'Skill', card.id)} // Skill IDを渡す
                  >
                    <div className="flex max-h-[120px] w-[230px] items-center gap-2">
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
                          <div
                            className="mb-1 truncate text-[12px] font-bold text-[#796E66]"
                            style={{ maxWidth: '160px' }} // テキストの長さ制限
                          >
                            {card.title} {/* タイトル */}
                          </div>
                        </div>
                        <div
                          className="line-clamp-3 pl-4 text-[12px] text-[#796E66]"
                          style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }} // 2行の説明文に制限
                        >
                          {card.description} {/* 説明 */}
                        </div>
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

import { Divider, Input } from 'antd'

import Image from 'next/image'
import { useState } from 'react'

import { Assets } from '@/constants'

const ModulesSelector = ({ onDragStart, onFilter }) => {
  // 入力値を管理する状態
  const [inputValue, setInputValue] = useState('')

  // 入力が変更された時の処理
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    onFilter(value) // フィルタ関数を呼び出す
  }

  // クリアボタンが押された時の処理
  const handleClear = () => {
    setInputValue('') // 入力値をクリア
    onFilter('') // フィルタを空にする
  }
  return (
    <div className="h-[250px] bg-white px-3 py-5">
      {/* 3つのモジュールアイコン */}
      <div className="flex justify-between gap-2">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="">
            <Image
              src={Assets.LOWCODEEDITOR.selector}
              className="h-[80px] w-[76px] shrink-0"
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
            value={inputValue} // 入力値を状態から取得
            placeholder="スキル名・説明"
            className="border border-solid border-[#E3E3E4]"
            prefix={
              <Image
                src={Assets.LOWCODEEDITOR.search}
                className="shrink-0"
                alt="search"
                width={18}
                height={18}
              />
            }
            suffix={
              <Image
                src={Assets.LOWCODEEDITOR.closed}
                className="cursor-pointer shrink-0"
                alt="clear"
                width={12}
                height={12}
                onClick={handleClear}
              />
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}

export default ModulesSelector
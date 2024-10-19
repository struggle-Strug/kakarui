import { ReactFlowProvider } from '@xyflow/react'

import Image from 'next/image'
import { useState } from 'react'
import 'reactflow/dist/style.css'

import { Assets } from '@/constants'

import Header from './Header'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import SequenceFlow from './SequenceFlow'

export const LowCodeEditorPresenter = () => {
  const [open, setOpen] = useState(true)
  // ボタンのクリックでDrawerの開閉をトグル
  const toggleDrawer = () => {
    setOpen(!open)
  }
  const [draggedNodeType, setDraggedNodeType] = useState(null)
  const [name, setName] = useState('Move to 001') // 初期値を設定

  // 入力が変更された時の処理
  const handleInputChange = (event) => {
    setName(event.target.value) // 入力内容を更新
  }

  return (
    <ReactFlowProvider>
      <div className="flex h-screen flex-col">
        {/* SECTION - ヘッダー */}
        <Header />

        <div className="flex h-[calc(100%-60px)] w-full justify-between">
          {/* SECTION - 左サイドバー */}
          <LeftSidebar setDraggedNodeType={setDraggedNodeType} />

          {/* SECTION - シーケンス */}
          <div className="w-full bg-[#E4E4E4]">
            <SequenceFlow
              draggedNodeType={draggedNodeType}
              setDraggedNodeType={setDraggedNodeType}
            />
          </div>

          {/* SECTION - drawer/ドロワー */}
          <div className="relative flex h-full items-center justify-center bg-white ">
            <div
              className="absolute mb-8 mr-6 flex h-[120px] w-[26px] cursor-pointer items-center justify-center rounded-l-3xl bg-white"
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
          {open && <RightSidebar />}
        </div>
      </div>
    </ReactFlowProvider>
  )
}

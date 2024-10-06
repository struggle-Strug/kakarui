import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import '@xyflow/react/dist/base.css'

import Image from 'next/image'
import React, { useCallback } from 'react'

import { Assets } from '@/constants'

import CustomNode from './../Node'

// カスタムノードのタイプ設定
const nodeTypes = {
  custom: CustomNode,
}

// 初期ノードの定義
const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: {
      type: 'Root',
      image: Assets.LOWCODEEDITOR.rootIcon,
    },
    position: { x: 0, y: 50 },
  },
  {
    id: '2',
    type: 'custom',
    data: {
      type: 'Sequence',
      image: Assets.LOWCODEEDITOR.sequenceIcon,
    },
    position: { x: 0, y: 200 },
  },
  {
    id: '3',
    type: 'custom',
    data: {
      type: 'Skill',
      image: Assets.LOWCODEEDITOR.skillIcon,
      skillName: 'Move to 001',
      skillType: 'Action / Move',
      customProperties: 'S01の前まで移動する。',
      userName: '羽田美希',
      updatedAt: '2024/9/4 18:22',
    },
    position: { x: -150, y: 350 },
  },
  {
    id: '4',
    type: 'custom',
    data: {
      type: 'Decorator',
      image: Assets.LOWCODEEDITOR.decoratorIcon,
      conditionalType: ['もしA=Bならば', 'もしA=Bでなければ'], // 条件文の選択肢
      aValues: ['選択 1', '選択 2'], // Aの選択肢
      bValues: ['選択 A', '選択 B'], // Bの選択肢
      userName: '川崎吾郎',
      updatedAt: '2024/9/4 18:22',
    },
    position: { x: 150, y: 350 },
  },
  {
    id: '5',
    type: 'custom',
    data: {
      type: 'Sub Tree',
      image: Assets.LOWCODEEDITOR.subTreeIcon,
      subTreeName: 'タオルを持つ',
      subTreeType: 'Function / Grab',
      customProperties: '棚からタオルを識別に掴みます。',
    },
    position: { x: 150, y: 600 },
  },
]

// 初期エッジの定義
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
]

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])

  // ドラッグを開始したときの処理
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  // ドロップしたときの処理
  const onDrop = (event) => {
    event.preventDefault()

    const reactFlowBounds = event.target.getBoundingClientRect()
    const type = event.dataTransfer.getData('application/reactflow')

    // マウスの位置を取得してフィールドの座標に変換
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    }

    // 新しいノードのデータを生成
    const newNode = generateNode(type, nodes.length + 1, position)

    setNodes((prevNodes) => [...prevNodes, newNode])
  }

  // ノードのデータを生成する関数
  const generateNode = (type, id, position) => {
    switch (type) {
      case 'Decorator':
        return {
          id: `node-${id}`,
          type: 'custom',
          data: {
            type: 'Decorator',
            image: Assets.LOWCODEEDITOR.decoratorIcon,
            conditionalType: ['もしA=Bならば', 'もしA=Bでなければ'], // 条件文の選択肢
            aValues: ['選択 1', '選択 2'], // Aの選択肢
            bValues: ['選択 A', '選択 B'], // Bの選択肢
            userName: '新規ユーザー',
            updatedAt: '2024/10/05',
          },
          position,
        }
      case 'Sequence':
        return {
          id: `node-${id}`,
          type: 'custom',
          data: {
            type: 'Sequence',
            image: Assets.LOWCODEEDITOR.sequenceIcon,
          },
          position,
        }
      case 'Skill':
        return {
          id: `node-${id}`,
          type: 'custom',
          data: {
            type: 'Skill',
            image: Assets.LOWCODEEDITOR.skillIcon,
            skillName: 'New Skill',
            skillType: 'Action / New Move',
            customProperties: '新しい動作を実行します。',
            userName: '新規スキルユーザー',
            updatedAt: '2024/10/05',
          },
          position,
        }
      default:
        return null
    }
  }

  // ドラッグ中のイベントハンドリング
  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  return (
    <div className="flex h-screen">
      {/* 左側のドラック可能な要素 */}
      {/* <div className="w-1/4 p-4 bg-gray-200">
        <div
          className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
          draggable
          onDragStart={(event) => onDragStart(event, 'Decorator')}
        >
          Drag Decorator
        </div>
        <div
          className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
          draggable
          onDragStart={(event) => onDragStart(event, 'Sequence')}
        >
          Drag Sequence
        </div>
        <div
          className="p-2 bg-white rounded shadow cursor-pointer"
          draggable
          onDragStart={(event) => onDragStart(event, 'Skill')}
        >
          Drag Skill
        </div>
      </div> */}

      {/* 右側のReactFlowフィールド */}
      <div className="relative w-full h-full bg-gray-50" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        />

        {/* 再生・停止ボタン */}
        <div className="absolute left-0 flex justify-center w-full gap-4 bottom-4">
          <div className="flex shadow">
            <button
              disabled={true}
              className="rounded-l border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
            >
              <Image
                src={Assets.LOWCODEEDITOR.caretRight2}
                className="h-[30px] w-[30px] shrink-0 "
                alt="gen3p"
                width={30}
                height={30}
              />
            </button>
            <button
              disabled={true}
              className="border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
            >
              <Image
                src={Assets.LOWCODEEDITOR.pause}
                className="h-[30px] w-[30px] shrink-0 "
                alt="gen3p"
                width={30}
                height={30}
              />
            </button>
            <button
              disabled={true}
              className="rounded-r border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
            >
              <Image
                src={Assets.LOWCODEEDITOR.square}
                className="h-[30px] w-[30px] shrink-0 "
                alt="gen3p"
                width={30}
                height={30}
              />
            </button>
          </div>
          <div className="flex shadow">
            <button
              disabled={true}
              className="rounded-l border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
            >
              <Image
                src={Assets.LOWCODEEDITOR.stepBack}
                className="h-[30px] w-[30px] shrink-0 "
                alt="gen3p"
                width={30}
                height={30}
              />
            </button>
            <button
              disabled={true}
              className="rounded-r border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
            >
              <Image
                src={Assets.LOWCODEEDITOR.stepForward}
                className="h-[30px] w-[30px] shrink-0 "
                alt="gen3p"
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flow

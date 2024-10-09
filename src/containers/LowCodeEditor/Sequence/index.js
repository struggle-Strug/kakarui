import { ReactFlow, addEdge, useEdgesState, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/base.css'

import { useCallback } from 'react'

import { Assets } from '@/constants'

import ControlButtons from '../ControlButton'
import CustomNode from './../Node'

let nodeId = 1
const getId = () => `node-${nodeId++}`
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
      siteData: ['S01', 'S02'],
      // customProperties: ['の前まで移動する', 'の後ろに移動する'],
      customProperties: 'の前まで移動する',
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

  // ドロップしたときの処理
  const onDrop = (event) => {
    event.preventDefault()

    const reactFlowBounds = event.target.getBoundingClientRect()
    const type = event.dataTransfer.getData('application/reactflow')

    // typeが存在しない場合、何も処理をしない
    if (!type) return

    // マウスの位置を取得してフィールドの座標に変換
    const position = {
      x: event.clientX - reactFlowBounds.left || 0,
      y: event.clientY - reactFlowBounds.top || 0,
    }

    // 新しいノードのデータを生成
    const newNode = generateNode(type, position)
    if (newNode) {
      setNodes((prevNodes) => [...prevNodes, newNode])
    }
  }

  // ドラッグオーバー時の処理（ドロップ可能領域を有効にする）
  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  // ノードのデータを生成する関数
  const generateNode = (type, position) => {
    const id = getId() // ユニークなIDを生成

    switch (type) {
      case 'Decorator':
        return {
          id,
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
          id,
          type: 'custom',
          data: {
            type: 'Sequence',
            image: Assets.LOWCODEEDITOR.sequenceIcon,
          },
          position,
        }
      case 'Skill':
        return {
          id,
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
  return (
    <div className="flex h-full">
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
        <ControlButtons />
      </div>
    </div>
  )
}

export default Flow

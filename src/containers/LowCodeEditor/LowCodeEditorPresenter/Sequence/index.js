import { ReactFlow, addEdge, useEdgesState, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/base.css'

import { useCallback } from 'react'

import { Assets } from '@/constants'

import ControlButtons from '../../ControlButton'
import CustomNode from './Node'
import { initialEdges, initialNodes } from './nodes-and-edges'

let nodeId = 1
const getId = () => `node-${nodeId++}`
// カスタムノードのタイプ設定
const nodeTypes = {
  custom: CustomNode,
}
const MIN_DISTANCE = 300

const Flow = () => {
  // const store = useStoreApi()

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  // const { getInternalNode } = useReactFlow()

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const getClosestEdge = useCallback((node) => {
    const { nodeLookup } = store.getState()
    // const internalNode = getInternalNode(node.id)
    const nodeHeight = 100 // ノードの高さを仮定（実際の高さに変更してください）

    const closestNode = Array.from(nodeLookup.values()).reduce(
      (res, n) => {
        if (n.id !== internalNode.id) {
          const dx = n.internals.positionAbsolute.x - internalNode.internals.positionAbsolute.x
          const dy =
            n.internals.positionAbsolute.y + nodeHeight - internalNode.internals.positionAbsolute.y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d
            res.node = n
          }
        }

        return res
      },
      {
        distance: Number.MAX_VALUE,
        node: null,
      }
    )

    if (!closestNode.node) {
      return null
    }

    const closeNodeIsSource =
      closestNode.node.internals.positionAbsolute.x < internalNode.internals.positionAbsolute.x

    // デフォルトのsource, targetだけを使う
    return {
      id: closeNodeIsSource
        ? `${closestNode.node.id}-${node.id}`
        : `${node.id}-${closestNode.node.id}`,
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      target: closeNodeIsSource ? node.id : closestNode.node.id,
    }
  }, [])

  const onNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node)

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp')

        if (
          closeEdge &&
          !nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)
        ) {
          closeEdge.className = 'temp'
          nextEdges.push(closeEdge)
        }

        return nextEdges
      })
    },
    [getClosestEdge, setEdges]
  )

  const onNodeDragStop = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node)

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp')

        if (
          closeEdge &&
          !nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)
        ) {
          nextEdges.push(closeEdge)
        }

        return nextEdges
      })
    },
    [getClosestEdge]
  )

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

      {/* 右側のReactFlowフィールド */}
      <div className="relative w-full h-full bg-gray-50" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
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

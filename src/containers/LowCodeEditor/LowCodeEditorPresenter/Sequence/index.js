import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from '@xyflow/react'
import '@xyflow/react/dist/base.css'

import { memo, useCallback } from 'react'

import ControlButtons from '../../ControlButton'
import CustomNode from './Node'
import { generateNode, initialEdges, initialNodes } from './nodes-and-edges'

// カスタムノードのタイプ設定
const nodeTypes = {
  custom: CustomNode,
}
const MIN_DISTANCE = 600

const Flow = () => {
  const store = useStoreApi()

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { getInternalNode, getNodes, getEdges } = useReactFlow()

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const getClosestEdge = useCallback((node) => {
    const { nodeLookup, connectionLookup } = store.getState()
    const internalNode = getInternalNode(node.id)

    const closestNode = Array.from(nodeLookup.values()).reduce(
      (res, n) => {
        if (n.id !== internalNode.id) {
          const dx = n.internals.positionAbsolute.x - internalNode.internals.positionAbsolute.x
          const dy =
            n.internals.positionAbsolute.y +
            n.measured.height -
            internalNode.internals.positionAbsolute.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // console.log('connectionLookup:', connectionLookup)
          // ターゲットノードの下部がソースノードの上部より上にあるかを確認
          if (
            // !isConnected &&
            n.internals.positionAbsolute.y + n.measured.height <
            internalNode.internals.positionAbsolute.y
          ) {
            // 最も近いノードをターゲットとして保存
            if (distance < res.distance && distance < MIN_DISTANCE) {
              res.distance = distance // 最も近い距離を更新
              res.node = n // 最も近いノードを更新
            }
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

    const closeNodeIsTarget =
      closestNode.node.internals.positionAbsolute.y > internalNode.internals.positionAbsolute.y

    return {
      id: closeNodeIsTarget
        ? `${node.id}-${closestNode.node.id}`
        : `${closestNode.node.id}-${node.id}`,
      source: node.id, // 掴んでいるノードの上部から接続
      target: closestNode.node.id, // ターゲットノードの下部に接続
    }
  }, [])

  // ドラッグ中に接続候補のエッジを描画する処理
  const onNodeDrag = useCallback(
    (_, node) => {
      const { edges: currentEdges } = store.getState()
      const isConnected = currentEdges.some(
        (edge) => edge.source === node.id || edge.target === node.id
      )

      const closeEdge = getClosestEdge(node)

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp')

        if (
          !isConnected &&
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

  // ドラッグ終了時に接続候補のエッジを確定させる処理
  const onNodeDragStop = useCallback(
    (_, node) => {
      const { edges: currentEdges } = store.getState()
      const isConnected = currentEdges.some(
        (edge) => edge.source === node.id || edge.target === node.id
      )
      const closeEdge = getClosestEdge(node)

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp')

        if (
          !isConnected &&
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
  const isValidConnection = useCallback(
    (connection) => {
      //  const { edges: currentEdges } = store.getState()
      //  const isConnected = currentEdges.some(
      //    (edge) => edge.source === node.id || edge.target === node.id
      //  )
      console.log('connection', connection)
      return false
    },
    [getNodes, getEdges, onNodeDragStop]
  )
  return (
    <div className="flex h-full">
      {/* 左側のドラック可能な要素 */}

      {/* 右側のReactFlowフィールド */}
      <div className="bg-gray-50 relative h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          isValidConnection={isValidConnection}
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

export default memo(Flow)

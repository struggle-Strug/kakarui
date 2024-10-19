import { ReactFlow, useEdgesState, useNodesState, useReactFlow, useStoreApi } from '@xyflow/react'
import '@xyflow/react/dist/base.css'

import { memo, useCallback } from 'react'

import ControlButtons from '../../ControlButton'
import CustomNode from './Node'
import { generateNode, initialEdges, initialNodes } from './nodes-and-edges'

const MIN_DISTANCE = 600

const SequenceFlow = () => {
  const store = useStoreApi()

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { getInternalNode, getNodes, getEdges, screenToFlowPosition } = useReactFlow()

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

  // 1度だけノードの情報をログする関数
  let targetNodeId = null
  let isTargetNodeConnected = false
  // 過度な再レンダリングを防ぐために1度だけノードの情報を取得する関数
  const logNodeOnce = useCallback((node) => {
    if (!targetNodeId) {
      const { edges: currentEdges } = store.getState()
      isTargetNodeConnected = currentEdges.some(
        (edge) => edge.source === node.id || edge.target === node.id
      )
      targetNodeId = node.id
    }
  }, [])

  // ドラッグ中に接続候補のエッジを描画する処理
  const onNodeDrag = useCallback(
    (_, node) => {
      // ここでドロップした時に1回だけノードの情報を引数に関数に渡す
      logNodeOnce(node)

      const closeEdge = getClosestEdge(node)

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp')

        if (
          !isTargetNodeConnected &&
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
      const closeEdge = getClosestEdge(node)
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp')

        if (
          !isTargetNodeConnected &&
          closeEdge &&
          !nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)
        ) {
          nextEdges.push(closeEdge)
        }
        targetNodeId = null
        return nextEdges
      })
    },
    [getClosestEdge]
  )

  // ドロップしたときの処理
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = event.target.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      // typeが存在しない場合、何も処理をしない
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // 新しいノードのデータを生成
      const newNode = generateNode(type, position)
      if (newNode) {
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    },
    [screenToFlowPosition]
  )

  // ドラッグオーバー時の処理（ドロップ可能領域を有効にする）
  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  // const nodeTypes = {
  //   custom: (props) => <CustomNode {...props} onDelete={handleDeleteNode} id={props.id} />,
  // }
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
          nodeTypes={{
            custom: CustomNode,
          }}
          deleteKeyCode={null}
          fitView
        />

        {/* 再生・停止ボタン */}
        <ControlButtons />
      </div>
    </div>
  )
}

export default memo(SequenceFlow)

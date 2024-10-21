import {
  ReactFlow,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from '@xyflow/react'
import '@xyflow/react/dist/base.css'
import 'antd/dist/reset.css'

import { memo, useCallback, useEffect, useState } from 'react'

import ControlButtons from '../ControlButton'
import CustomNode from './Node'
import { generateNode, initialEdges, initialNodes } from './nodes-and-edges'

// Ant Designのデフォルトスタイル
const MIN_DISTANCE = 800

const SequenceFlow = ({ draggedNodeType, setDraggedNodeType }) => {
  const store = useStoreApi()

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { getInternalNode, getNodes, getEdges, screenToFlowPosition, deleteElements } =
    useReactFlow()

  const [selectedNodeIds, setSelectedNodeIds] = useState([]) // 選択されたノードのIDを管理する配列

  // ノードがクリックされた時の処理
  const onNodeClick = useCallback((event, node) => {
    event.stopPropagation() // イベントバブリングを防止
    // Rootタイプのノードは選択処理をスキップ
    if (node.data.type === 'Root') {
      return
    }
    setSelectedNodeIds((prevSelectedNodeIds) => {
      // クリックされたノードが既に選択されているかどうかを確認
      if (prevSelectedNodeIds.includes(node.id)) {
        // 既に選択されている場合は、そのノードを配列から削除
        return prevSelectedNodeIds.filter((id) => id !== node.id)
      }
      // 選択されていない場合は、そのノードのIDを配列に追加
      return [...prevSelectedNodeIds, node.id]
    })
  }, [])

  // 選択されたノードかつdata.typeがRoot以外の場合に"select"クラスを付与
  const nodeWithClasses = nodes.map((node) => {
    // Rootタイプの場合はそのまま早期リターン
    if (node.data.type === 'Root') {
      return node
    }
    // Root以外で選択されているノードにクラスを付与
    return {
      ...node,
      className: selectedNodeIds.includes(node.id) ? 'select' : '',
    }
  })

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

  // 1度だけ掴んでいるノードの情報をセットする。過度な再レンダリングを防止。
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
      // 既に接続しているノードであればエッジ追加の処理をしない
      if (isTargetNodeConnected || node.data.type === 'Root') {
        return
      }
      // 新規ノードで接続先ノードがない場合はキャンセル（追加しない）
      if (
        !closeEdge &&
        !edges.find((ne) => ne.source === node.source && ne.target === node.target)
      ) {
        deleteElements({ nodes: [{ id: node.id }] })
      }
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
        isTargetNodeConnected = false
        return nextEdges
      })
    },
    [getClosestEdge]
  )

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges)
          const outgoers = getOutgoers(node, nodes, edges)
          const connectedEdges = getConnectedEdges([node], edges)
          const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge))
          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          )
          return [...remainingEdges, ...createdEdges]
        }, edges)
      )
      targetNodeId = null
      isTargetNodeConnected = false
    },
    [nodes, edges]
  )

  //TODO - ドラッグしてフィールドに入ったときにノードを生成。onDragEnterでフィールド内に入ると生成されるような方針を検討。
  // const onDragEnter = useCallback(
  //   (event) => {
  //     event.preventDefault()
  //     const type = event.dataTransfer.getData('application/reactflow')
  //     // typeが存在しない場合、何も処理をしない
  //     if (!type) return

  //     const position = screenToFlowPosition({
  //       x: event.clientX,
  //       y: event.clientY,
  //     })

  //     // 新しいノードのデータを生成
  //     const newNode = generateNode(type, position)

  //     if (newNode) {
  //       setNodes((prevNodes) => [...prevNodes, newNode])
  //     }
  //   },
  //   [screenToFlowPosition]
  // )

  // ドロップしたときの処理
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      let skillData = null
      // typeがSkillの場合のみskillDataを取得
      if (type === 'Skill') {
        const skillDataRaw = event.dataTransfer.getData('skillData')
        // skillDataが存在するかチェックして、JSON.parseを安全に実行
        if (skillDataRaw) {
          try {
            skillData = JSON.parse(skillDataRaw)
          } catch (error) {
            console.error('Invalid JSON in skillData:', error)
            skillData = null // JSONが無効ならnullを設定
          }
        }
      }
      // typeが存在しない場合、何も処理をしない
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      // 新しいノードのデータを生成
      const newNode = generateNode(type, position, skillData)
      targetNodeId = null
      isTargetNodeConnected = false
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
  const [contextMenu, setContextMenu] = useState(null) // コンテキストメニューの位置と表示状態を管理

  // 右クリック時の処理
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault() // デフォルトのコンテキストメニューを無効化
    // コンテキストメニューを表示する位置を設定
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      nodeId: node.id,
    })
  }, [])

  // メニュー項目がクリックされた時の処理
  const handleMenuClick = (action) => {
    //TODO - サブツリーとして登録する処理を追加する
    console.log(`Action ${action.key} triggered on node ${contextMenu.nodeId}`)
    setContextMenu(null) // メニューを閉じる
    setSelectedNodeIds([])
    alert('サブツリーとして登録されました')
  }

  // 右クリックの外部クリックでメニューを閉じる処理
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        setContextMenu(null) // メニューを閉じる
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu])
  return (
    <div className="flex h-full">
      {/* 左側のドラック可能な要素 */}
      {/* 右側のReactFlowフィールド */}
      <div
        className="bg-gray-50 relative h-full w-full"
        onDragOver={onDragOver}
        onDrop={onDrop}
        // onDragEnter={onDragEnter}
      >
        <ReactFlow
          nodes={nodeWithClasses}
          edges={edges}
          onNodeClick={onNodeClick}
          onNodesDelete={onNodesDelete}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={{ custom: CustomNode }}
          deleteKeyCode={null}
          fitView
          onNodeContextMenu={selectedNodeIds.length >= 2 && onNodeContextMenu} // 右クリック時のイベントハンドラを指定
        />

        {/* 再生・停止ボタン */}
        <ControlButtons />
      </div>
      {/* カスタムコンテキストメニュー */}
      {contextMenu && (
        <div
          style={{
            position: 'absolute',
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            zIndex: 1000,
          }}
          className="bg-white text-start"
        >
          <div className="cursor-pointer rounded-xl border border-solid border-gray">
            <button
              className="py-2 pl-2 pr-4 text-sm hover:opacity-50"
              disabled={selectedNodeIds.length < 2}
              onClick={handleMenuClick}
            >
              サブツリーとして登録
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(SequenceFlow)

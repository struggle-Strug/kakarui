import React, { useCallback, useRef, useState } from 'react'
import { Suspense, useEffect, useMemo } from 'react'
import { Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'

// 初期ノードとエッジの設定
const initialNodes = [
  {
    id: 'root', // ノードID
    type: 'default', // ノードの種類（デフォルト）
    data: { label: 'root' }, // ノードのラベル
    position: { x: 0, y: 0 }, // ノードの初期位置（後で画面中央に変更）
    draggable: true, // ノードをドラッグ可能にする
  },
]

const initialEdges = []

const DnDFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesState] = useEdgesState(initialEdges)
  const [nodeId, setNodeId] = useState(1) // ノードIDを管理
  const reactFlowWrapper = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null) // 選択されたノードの状態
  const [menuPosition, setMenuPosition] = useState(null) // メニューの位置

  // ノード削除イベント
  const onNodesDelete = useCallback(
    (deletedNodes) => {
      setNodes((nds) => nds.filter((node) => !deletedNodes.some((n) => n.id === node.id)))
      setEdges((eds) =>
        eds.filter(
          (edge) => !deletedNodes.some((n) => edge.source === n.id || edge.target === n.id)
        )
      )
    },
    [setNodes, setEdges]
  )

  // キーボードイベント(ノード削除)の設定
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' && selectedNode) {
        onNodesDelete([selectedNode])
        setSelectedNode(null) // 選択をリセット
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedNode, onNodesDelete])

  // 初期表示時に「root」ノードを中央に配置する
  useEffect(() => {
    if (reactFlowWrapper.current) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()

      // 中央に位置を計算
      const centerX = reactFlowBounds.width / 2 - 50 // ノード幅を考慮
      const centerY = reactFlowBounds.height / 6 - 25 // ノード高さを考慮

      setNodes((nds) =>
        nds.map((node) =>
          node.id === 'root'
            ? { ...node, position: { x: centerX, y: centerY } } // 中央に位置を修正
            : node
        )
      )
    }
  }, [reactFlowWrapper, setNodes])

  // ドラッグスタートイベント
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  // ドロップイベントでノード追加
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()

      // 新しいノードの位置を計算
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      // 新しいノードを追加
      const newNode = {
        id: `${nodeId}`,
        data: { label: `Node ${nodeId}` },
        position,
        draggable: true,
      }

      setNodes((nds) => nds.concat(newNode))
      setNodeId((id) => id + 1) // ノードIDを更新

      // 最も近いノードにエッジを繋げる
      const closestNode = findClosestNode(position, nodes)
      if (closestNode) {
        const newEdge = {
          id: `e${closestNode.id}-${newNode.id}`,
          source: closestNode.id,
          target: newNode.id,
          type: 'smoothstep',
        }
        setEdges((eds) => eds.concat(newEdge))
      }
    },
    [nodeId, nodes, setNodes, setEdges]
  )

  // ノードと新しいノードの距離を計算する関数
  const findClosestNode = (position, nodes) => {
    let closestNode = null
    let minDistance = Infinity

    nodes.forEach((node) => {
      const dx = node.position.x - position.x
      const dy = node.position.y - position.y
      const distance = Math.sqrt(dx * dx + dy * dy) // ユークリッド距離

      if (distance < minDistance) {
        minDistance = distance
        closestNode = node
      }
    })

    return closestNode
  }

  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  // ノードがクリックされたときにエッジを作成する処理
  const onNodeClick = useCallback(
    (event, node) => {
      if (selectedNode) {
        const newEdge = {
          id: `e${selectedNode.id}-${node.id}`,
          source: selectedNode.id,
          target: node.id,
          type: 'smoothstep',
        }
        setEdges((eds) => eds.concat(newEdge))
        setSelectedNode(null) // 選択をリセット
      } else {
        setSelectedNode(node)
      }
    },
    [selectedNode, setEdges]
  )

  // ノード右クリックイベント
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault()
    setMenuPosition({ x: event.clientX, y: event.clientY })
    setSelectedNode(node)
  }, [])

  // メニューを閉じる
  const closeMenu = () => {
    setMenuPosition(null)
    setSelectedNode(null)
  }

  return (
    <div className="dndflow">
      {/* ドラッグ可能なノードパレット */}
      <div className="reactflow-wrapper" style={{ display: 'flex', height: '100vh' }}>
        <div style={{ width: '200px', background: '#f0f0f0', padding: '10px' }}>
          <div
            className="dndnode input"
            onDragStart={(event) => onDragStart(event, 'Selector')}
            draggable
            style={{
              marginBottom: '10px',
              padding: '10px',
              background: '#9c88ff',
              cursor: 'pointer',
            }}
          >
            Selector
          </div>
          <div
            className="dndnode output"
            onDragStart={(event) => onDragStart(event, 'Sequence')}
            draggable
            style={{ padding: '10px', background: '#00a8ff', cursor: 'pointer' }}
          >
            Sequence
          </div>
        </div>

        {/* ノードのキャンバス */}
        <div
          className="reactflow-wrapper"
          style={{ flexGrow: 1, height: '100%' }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesState}
            onNodesDelete={onNodesDelete} // ノード削除イベントを追加
            onNodeClick={onNodeClick} // ノードクリックイベントハンドラを追加
            attributionPosition={null}
            onNodeContextMenu={onNodeContextMenu} // 右クリックイベントを追加
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>

      {/* サブメニュー */}
      {menuPosition && (
        <div
          style={{
            position: 'absolute',
            left: menuPosition.x,
            top: menuPosition.y,
            background: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            zIndex: 1000,
            padding: '10px',
          }}
          onMouseLeave={closeMenu} // マウスが外れたときにメニューを閉じる
        >
          <h4>Properties</h4>
          <p>Node ID: {selectedNode?.id}</p>
          <p>Node Label: {selectedNode?.data.label}</p>
          {/* その他の設定項目 */}
          <button onClick={closeMenu}>Close</button>
        </div>
      )}
    </div>
  )
}

export default DnDFlow

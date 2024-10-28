import { ReactFlowProvider } from '@xyflow/react';
import Image from 'next/image';
import { useState } from 'react';
import 'reactflow/dist/style.css';

import { Assets } from '@/constants';
import { useNodesState, useEdgesState } from '@xyflow/react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import SequenceFlow from './SequenceFlow';

import { initialNodes, initialEdges } from './SequenceFlow/nodes-and-edges';

export const LowCodeEditorPresenter = ({ skills, loading }) => {
  // Drawerの状態管理
  const [open, setOpen] = useState(true);

  // 選択されたスキルIDの管理
  const [selectedSkillId, setSelectedSkillId] = useState('');

  // ドラッグされているノードタイプの管理
  const [draggedNodeType, setDraggedNodeType] = useState(null);

  // ノードとエッジの状態管理
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // JSONデータをインポートしてノードとエッジを更新する関数
  const handleLoadData = (importedNodes, importedEdges) => {
    setNodes(importedNodes); // ノードをインポートされたデータで更新
    setEdges(importedEdges); // エッジをインポートされたデータで更新
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen flex-col">
        {/* ヘッダーコンポーネント、handleLoadDataを渡す */}
        <Header nodes={nodes} onLoadData={handleLoadData} /> {/* handleLoadDataを渡す */}

        <div className="flex h-[calc(100%-60px)] w-full justify-between">
          {/* 左サイドバー */}
          <LeftSidebar skills={skills} setDraggedNodeType={setDraggedNodeType} />

          {/* メインのシーケンスフロービュー */}
          <div className="w-full bg-[#E4E4E4]">
            <SequenceFlow
              nodes={nodes}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              edges={edges}              // エッジの状態を渡す
              setEdges={setEdges}        // エッジを設定する関数を渡す
              onEdgesChange={onEdgesChange}
              draggedNodeType={draggedNodeType}
              setDraggedNodeType={setDraggedNodeType}
              selectedSkillId={selectedSkillId}
              setSelectedSkillId={setSelectedSkillId}
            />
          </div>

          {/* 右サイドバー */}
          <div className="relative flex h-full items-center justify-center bg-white ">
            <div
              className="absolute mb-8 mr-6 flex h-[120px] w-[26px] cursor-pointer items-center justify-center rounded-l-3xl bg-white"
              onClick={() => setOpen(!open)} // Drawerの開閉を切り替える
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

          {/* 右サイドバー（Drawerが開いている場合のみ表示） */}
          {open && <RightSidebar skillId={selectedSkillId} skills={skills} />}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

import { Handle, Position, useReactFlow } from '@xyflow/react'

import { memo } from 'react'

import { DecoratorNode } from './DecoratorNode'
import { NodeHeader } from './NodeHeader'
import { SkillNode } from './SkillNode'
import { SubTreeNode } from './SubTreeNode'

// 背景色を`type`に応じて設定
const typeToBgColor = {
  Root: '#413D39',
  Sequence: '#B43F2C',
  Skill: '#E1A23A',
  Decorator: '#4D997D',
  'Sub Tree': '#B36E02',
}
// カスタムノードコンポーネント
const CustomNode = ({ data, id, dragging }) => {
  const { deleteElements, getEdges } = useReactFlow()

  // バツボタンを押したときにノードを削除
  const handleDeleteNode = () => {
    const edges = getEdges()
    const connectedEdges = edges.filter((edge) => edge.target === id)
    const childNodeIds = connectedEdges.map((edge) => edge.source)
    deleteElements({ nodes: [{ id: id }] })
    //TODO - 親ノードが消えた場合に子ノードも消える仕様の場合は以下を使用
    // deleteElements({ nodes: [{ id: id }, ...childNodeIds.map((id) => ({ id }))] })
  }

  // 背景色を取得
  const bgColor = typeToBgColor[data.type] || '#413D39'

  return (
    <div className="cursor-pointer rounded-[13px] bg-white px-2 py-2">
      <div className="w-[250px]">
        <NodeHeader data={data} handleDeleteNode={handleDeleteNode} bgColor={bgColor} />

        {data.type === 'Skill' && <SkillNode data={data} />}
        {data.type === 'Decorator' && <DecoratorNode data={data} />}
        {data.type === 'Sub Tree' && <SubTreeNode data={data} />}

        <Handle
          type="target"
          position={Position.Bottom}
          className="w-24 !border !border-solid !border-[#796E66] !bg-white p-1"
        />
      </div>
    </div>
  )
}

export default memo(CustomNode)

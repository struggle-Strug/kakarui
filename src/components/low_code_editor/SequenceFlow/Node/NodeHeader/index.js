import { Handle, Position } from '@xyflow/react'

import Image from 'next/image'

export const NodeHeader = ({ data, handleDeleteNode, bgColor }) => (
  <>
    {/* ノードのターゲットとソースのハンドル */}
    {data.type !== 'Root' && (
      <Handle
        type="source"
        position={Position.Top}
        className="w-24 !border !border-solid !border-[#796E66] !bg-white p-1"
      />
    )}
    <div
      className="flex justify-between w-full px-2 py-2 rounded"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-2">
        {/* モジュールアイコン */}
        {data.image && (
          <Image
            src={data.image}
            className="w-[20px] shrink-0"
            alt="gen3p"
            width={40}
            height={40}
          />
        )}
        <div className="font-bold text-white">{data.type}</div>
      </div>
      {data.type !== 'Root' && (
        <div className="text-white cursor-pointer" onClick={handleDeleteNode}>
          ×
        </div>
      )}
    </div>
  </>
)

import Image from 'next/image'

import { Assets } from '@/constants'

//NOTE - childrenNodesはDecoratorの子要素内に入るSkillやSub Treeのことで
export const DecoratorNode = ({ data, childrenNodes, onDropNode }) => {
  const handleSelectClick = (event) => {
    event.stopPropagation() // 親要素のクリックイベントが発火しないように
  }

  //TODO - 未実装：ノードがドロップされた際に呼ばれる
  //   const handleNodeDrop = (event) => {
  //     const droppedNodeId = event.dataTransfer.getData('nodeId')
  //     if (droppedNodeId) {
  //       onDropNode(droppedNodeId)
  //     }
  //   }

  return (
    <div
      className="flex w-full flex-col gap-2 p-2"
      //   onDrop={handleNodeDrop}
      onDragOver={(e) => e.preventDefault()} // ドロップ可能にするためのイベント
    >
      {/* <label>Condition Type: </label> */}
      <select
        onClick={handleSelectClick}
        className="w-full rounded-md border-2 border-solid border-[#E3E3E4] p-1"
      >
        {data?.conditionalType?.map((condition, index) => (
          <option key={index} value={condition}>
            {condition}
          </option>
        ))}
      </select>
      <div>
        <span className="pl-2 text-[14px] font-bold">A</span>
        <select
          onClick={handleSelectClick}
          className="ml-4 rounded border-2 border-solid border-[#E3E3E4] p-1"
        >
          {/* Aの値を選択肢として表示 */}
          {data?.aValues?.map((aValue, index) => (
            <option key={index} value={aValue}>
              {aValue}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="pl-2 text-[14px] font-bold">B</span>
        <select
          onClick={handleSelectClick}
          className="ml-4 rounded border-2 border-solid border-[#E3E3E4] p-1"
        >
          {/* Bの値を選択肢として表示 */}
          {data?.bValues?.map((bValue, index) => (
            <option key={index} value={bValue}>
              {bValue}
            </option>
          ))}
        </select>
      </div>

      {/* Skill や Sub Tree の表示部分 */}
      {/* TODO - まだchildrenNodesの実装できていない */}
      {childrenNodes && (
        <div className="mt-4">
          <div className="flex flex-col gap-2 rounded-md p-2">
            {childrenNodes.length > 0 &&
              childrenNodes.map((node, index) => (
                <div key={index} className="bg-gray-100 rounded-md p-2">
                  {node.type === 'Skill' && <SkillNode data={node} />}
                  {node.type === 'Sub Tree' && <SubTreeNode data={node} />}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 最終更新ユーザーと日時 */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Image
            src={Assets.LOWCODEEDITOR.userIcon}
            className="w-[20px] shrink-0"
            alt="gen3p"
            width={20}
            height={20}
          />
          <div className="truncate text-[14px]">{data.userName}</div>
        </div>
        <div className="flex items-center gap-1">
          <Image
            src={Assets.LOWCODEEDITOR.timeIcon}
            className="w-[20px] shrink-0"
            alt="gen3p"
            width={20}
            height={20}
          />
          <div className="truncate text-[14px]">{data.updatedAt}</div>
        </div>
      </div>
    </div>
  )
}

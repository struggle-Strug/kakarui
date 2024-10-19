export const SubTreeNode = ({ data }) => (
  <div className="flex flex-col gap-2 p-2">
    <div className="text-[14px] font-bold">Name: {data.subTreeName}</div>
    <div className="text-[14px] font-bold">Type: {data.subTreeType}</div>
    <div className="mt-2 text-[14px] font-bold">{data.customProperties}</div>
  </div>
)

import Image from 'next/image'

import { Assets } from '@/constants'

export const DecoratorNode = ({ data }) => (
  <div className="flex w-full flex-col gap-2 p-2">
    {/* <label>Condition Type: </label> */}
    <select className="w-full rounded-md border-2 border-solid border-[#E3E3E4] p-1">
      {data.conditionalType.map((condition, index) => (
        <option key={index} value={condition}>
          {condition}
        </option>
      ))}
    </select>
    <div>
      <span className="pl-2 text-[14px] font-bold">A</span>
      <select className="ml-4 rounded border-2 border-solid border-[#E3E3E4] p-1">
        {/* Aの値を選択肢として表示 */}
        {data.aValues.map((aValue, index) => (
          <option key={index} value={aValue}>
            {aValue}
          </option>
        ))}
      </select>
    </div>
    <div>
      <span className="pl-2 text-[14px] font-bold">B</span>
      <select className="ml-4 rounded border-2 border-solid border-[#E3E3E4] p-1">
        {/* Bの値を選択肢として表示 */}
        {data.bValues.map((bValue, index) => (
          <option key={index} value={bValue}>
            {bValue}
          </option>
        ))}
      </select>
    </div>
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

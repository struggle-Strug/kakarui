import Image from 'next/image'

import { Assets } from '@/constants'

const ControlButtons = () => {
  return (
    <div className="absolute left-0 flex justify-center w-full gap-4 bottom-8">
      <div className="flex shadow">
        <button
          disabled={true}
          className="rounded-l border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
        >
          <Image
            src={Assets.LOWCODEEDITOR.caretRight2}
            className="h-[30px] w-[30px] shrink-0 "
            alt="gen3p"
            width={30}
            height={30}
          />
        </button>
        <button
          disabled={true}
          className="border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
        >
          <Image
            src={Assets.LOWCODEEDITOR.pause}
            className="h-[30px] w-[30px] shrink-0 "
            alt="gen3p"
            width={30}
            height={30}
          />
        </button>
        <button
          disabled={true}
          className="rounded-r border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
        >
          <Image
            src={Assets.LOWCODEEDITOR.square}
            className="h-[30px] w-[30px] shrink-0 "
            alt="gen3p"
            width={30}
            height={30}
          />
        </button>
      </div>
      <div className="flex shadow">
        <button
          disabled={true}
          className="rounded-l border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
        >
          <Image
            src={Assets.LOWCODEEDITOR.stepBack}
            className="h-[30px] w-[30px] shrink-0 "
            alt="gen3p"
            width={30}
            height={30}
          />
        </button>
        <button
          disabled={true}
          className="rounded-r border border-solid border-[#D3D3D3] bg-[#EDEDED] px-2 py-2"
        >
          <Image
            src={Assets.LOWCODEEDITOR.stepForward}
            className="h-[30px] w-[30px] shrink-0 "
            alt="gen3p"
            width={30}
            height={30}
          />
        </button>
      </div>
    </div>
  )
}

export default ControlButtons

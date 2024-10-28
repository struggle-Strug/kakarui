import { Spin } from 'antd'

const LogContent = ({ isReading, wrapperContentRef, lastElementRef }) => {
  return (
    <div className="col-span-2">
      <Spin className="w-full" spinning={isReading}>
        <div className="flex h-full max-h-[60vh] min-h-[60vh] w-full grow flex-col overflow-x-scroll overflow-y-scroll overscroll-auto scroll-smooth rounded-lg border border-solid border-[#d5d3d2] !bg-light-gray p-6 !text-primary ">
          <div
            ref={wrapperContentRef}
            className="flex h-full w-full flex-col-reverse whitespace-pre-line break-words"
          />
          <div ref={lastElementRef} className="h-1 w-full">
            &nbsp;
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default LogContent

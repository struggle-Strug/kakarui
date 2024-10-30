/* eslint-disable no-param-reassign */
import { PlusOutlined } from '@ant-design/icons'
import { Upload, message } from 'antd'

import { forwardRef, useEffect, useState } from 'react'

const InputTarFile = (props, ref) => {

  const { accept = 'application/x-tar', disabled, onChange, fileList, setFileList } = props
  
  useEffect(() => {
      setFileList([])
  },[disabled])

  const beforeUpload = () => {
    return false
  }

  const handleUploadChange = ({ file, fileList: updatedFileList }) => {
    const isAcceptFile = accept.includes(file.type)
    if (!isAcceptFile) {
      message.error('tarファイルをアップロードしてください。')
      return false
    }
    if (updatedFileList.length > 1) {
      updatedFileList = updatedFileList.slice(-1) // Keep only the latest file
    }
    setFileList(updatedFileList)
    onChange(file)
    return false
  }

  return (
    <Upload
      name="upload"
      accept={accept}
      multiple={false}
      fileList={fileList}
      beforeUpload={beforeUpload}
      onChange={handleUploadChange}
      disabled={disabled}
      className='pl-12'
    >
      <input type="hidden" ref={ref} />
      <div className="flex-center aspect-square w-32 cursor-pointer flex-col rounded-lg border border-dashed bg-light-gray p-3">
        <PlusOutlined />
        <div className="mt-2 text-center">Upload</div>
      </div>
    </Upload>
  )
}

export default forwardRef(InputTarFile)

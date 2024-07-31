/* eslint-disable no-param-reassign */
import { PlusOutlined } from '@ant-design/icons'
import { Upload, message } from 'antd'

import { forwardRef, useState } from 'react'

import { MAX_FILE_SIZE } from '@/constants'

const InputTarFile = (props, ref) => {
  const [fileList, setFileList] = useState([])

  const { accept = 'application/x-tar', maxSize = MAX_FILE_SIZE, disabled, onChange } = props

  const beforeUpload = () => {
    return false
  }

  const handleUploadChange = ({ file, fileList: updatedFileList }) => {
    const isAcceptFile = accept.includes(file.type)
    const isLtMaxFileSize = file.size <= maxSize * 1024 * 1024
    if (!isAcceptFile) {
      message.error('tarファイルをアップロードしてください。')
      return false
    }
    if (!isLtMaxFileSize) {
      message.error(`${maxSize}MB以下のファイルをアップロードしてください。`)
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
    >
      <input type="hidden" ref={ref} />
      <div className="flex-center aspect-square w-32 cursor-pointer flex-col rounded-lg border border-dashed bg-light-gray p-3">
        <PlusOutlined />
        <div className="mt-2">Upload</div>
      </div>
    </Upload>
  )
}

export default forwardRef(InputTarFile)

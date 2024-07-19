import { forwardRef, useEffect, useState } from 'react'

import { ACCEPT_UPLOAD_FILE_TYPE } from '@/constants'

import { TrashIcon } from '@/components/icons'

import { getFileNameFromUrl } from '@/utils/helper/file'

import Button from '../Button'
import UploadFile from '../UploadFile'

const InputAudio = (props, ref) => {
  const { fileUrl, onChangeFileUrl, removeFileUrl, disabled } = props || {}

  const [fileName, setFileName] = useState(getFileNameFromUrl(fileUrl))

  const onChangeFile = (value) => {
    onChangeFileUrl(value)
  }

  const onRemoveFile = () => {
    setFileName(null)
    removeFileUrl()
  }

  useEffect(() => {
    if (!fileName) {
      setFileName(getFileNameFromUrl(fileUrl))
    }
  }, [fileUrl])

  return (
    <article ref={ref} className="flex max-w-lg flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <div className="flex-auto overflow-x-hidden">
          <UploadFile
            accept={ACCEPT_UPLOAD_FILE_TYPE.AUDIO}
            onChangeFile={onChangeFile}
            setFileName={setFileName}
            fileName={fileName}
            disabled={disabled}
          />
        </div>
        {!disabled ? (
          <Button type="error" icon={<TrashIcon />} onClick={onRemoveFile}>
            削除
          </Button>
        ) : null}
      </div>
    </article>
  )
}

export default forwardRef(InputAudio)

import { Image } from 'antd'

import { forwardRef, useEffect, useState } from 'react'

import { TrashIcon } from '@/components/icons'

import { getFileNameFromUrl } from '@/utils/helper/file'

import Button from '../Button'
import Input from '../Input'
import UploadFile from '../UploadFile'

const InputImage = (props, ref) => {
  const {
    index,
    slug,
    fileUrl,
    onChangeFileUrl,
    onChangeSlug,
    removeFileUrl,
    hasSlug = false,
    showDelete = true,
    deleteText = '削除',
    disabled,
  } = props || {}

  const [image, setImage] = useState(null)
  const [fileName, setFileName] = useState(getFileNameFromUrl(fileUrl))

  const handleChangeSlug = (e) => {
    onChangeSlug(e.target.value)
  }

  const onChangeFile = (value) => {
    onChangeFileUrl(value)
    setImage(value)
  }

  const onRemoveFile = () => {
    removeFileUrl?.()
    setFileName(null)
    setImage(null)
  }

  useEffect(() => {
    setImage(fileUrl)
    setFileName(getFileNameFromUrl(fileUrl))
  }, [fileUrl])

  return (
    <article ref={ref} className="flex max-w-lg flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <div className="flex-auto overflow-x-hidden">
          <UploadFile
            onChangeFile={onChangeFile}
            fileName={fileName}
            setFileName={setFileName}
            disabled={disabled}
          />
        </div>
        {!disabled && showDelete ? (
          <Button type="error" icon={<TrashIcon />} onClick={onRemoveFile}>
            {deleteText}
          </Button>
        ) : null}
      </div>
      {hasSlug && <Input value={slug} onChange={handleChangeSlug} placeholder="リンク先URL" />}
      {!!image && (
        <Image
          loading="lazy"
          className="max-h-[390px] rounded-lg border border-solid border-outline object-cover"
          alt={`slug_${index}`}
          src={`${image}`}
        />
      )}
    </article>
  )
}

export default forwardRef(InputImage)

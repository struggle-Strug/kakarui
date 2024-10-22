import { Upload, message } from 'antd'

import { forwardRef, memo, useEffect, useMemo, useState } from 'react'

import { API, API_ROOT, MAX_FILE_SIZE } from '@/constants'
import { useAuth } from '@/hooks/query/auth'

import { DeleteIcon, LoadingIcon, PlusIcon } from '@/components/icons'

import { checkAspectRatio, getURLOrBase64, getUrlFromUploadResponse } from '@/utils/helper/image'

const UPLOAD_PATH = `${API_ROOT}${API.UPLOAD}`

function DeleteButton({ onClick }) {
  return (
    <div className="hover:bg-black/30 text-sub-blue absolute right-0 top-0 hidden h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-opacity-50 transition-all group-hover:flex">
      <DeleteIcon onClick={onClick} />
    </div>
  )
}

export const ShowImageOrPlaceholder = memo((props) => {
  const { imageUrl, loading, canDelete, onDelete, disabled } = props

  return imageUrl ? (
    <div className="group relative h-full w-full overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        alt="avatar"
      />
      {canDelete && onDelete && !disabled && <DeleteButton onClick={onDelete} />}
    </div>
  ) : (
    <div className="flex-center aspect-square w-[142px] flex-col p-3">
      {loading ? <LoadingIcon /> : <PlusIcon />}
      <div className="mt-2">Upload</div>
    </div>
  )
})

const BaseUploadImage = (props, fileRef) => {
  const {
    accept = 'image/png, image/jpeg',
    maxSize = MAX_FILE_SIZE,
    ratioText = '375 x 212',
    isUploadFile = false,
    canDelete = true,
    aspectRatio,
    onChange,
    disabled,
    value,
  } = props

  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    setImageUrl(value)
    return () => {
      setImageUrl(null)
    }
  }, [value])

  const authorization = useMemo(() => (token ? `Bearer ${token}` : null), [token])

  const beforeUpload = async (file) => {
    const isAcceptFile = accept.includes(file.type)
    const isLtMaxFileSize = file.size <= maxSize * 1024 * 1024

    if (!isAcceptFile) {
      message.error('PNGまたはJPGファイルをアップロードしてください。')
      return false
    }

    if (!isLtMaxFileSize) {
      message.error(`${maxSize}MB以下の画像をアップロードしてください。`)
      return false
    }

    if (aspectRatio) {
      try {
        const isAspectRatioMatch = await checkAspectRatio(file, aspectRatio)
        if (!isAspectRatioMatch) {
          message.error(`画像を「${ratioText} px」のサイズでアップロードしてください。`)
          return false
        }
      } catch (error) {
        message.error('アップロードに失敗しました。')
        return false
      }
    }

    return true
  }

  const handleUploadChange = async ({ file } = {}) => {
    const { status, response } = file || {}

    if (isUploadFile) {
      setLoading(true)
      onChange?.(file.originFileObj)

      const reader = new FileReader()
      reader.readAsDataURL(file.originFileObj)
      reader.onloadend = () => {
        setLoading(false)
        setImageUrl(reader.result)
      }
      return
    }

    setLoading(status === 'uploading')

    if (status === 'done') {
      setLoading(false)

      const url = await getUrlFromUploadResponse(response, file)
      onChange?.(url)
      setImageUrl(url)
    }

    if (status === 'error') {
      message.error('アップロードに失敗しました。')
      setLoading(false)
    }
  }

  const getUploadAction = (file) => {
    if (!isUploadFile) {
      return UPLOAD_PATH
    }
    return getURLOrBase64(file, true)
  }

  const onDelete = (e) => {
    e?.stopPropagation?.()
    onChange?.('')
    setImageUrl(null)
  }

  return (
    <Upload
      name="upload"
      ref={fileRef}
      accept={accept}
      multiple={false}
      listType="picture-card"
      beforeUpload={beforeUpload}
      onChange={handleUploadChange}
      disabled={disabled || loading}
      headers={{ authorization }}
      action={getUploadAction}
      showUploadList={false}
    >
      <ShowImageOrPlaceholder {...{ imageUrl, loading, canDelete, onDelete, disabled }} />
    </Upload>
  )
}

export default forwardRef(BaseUploadImage)

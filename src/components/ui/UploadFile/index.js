import { Upload, message } from 'antd'

import { forwardRef, useMemo, useState } from 'react'

import {
  ACCEPT_UPLOAD_FILE_TYPE,
  API,
  API_ROOT,
  ERROR_ACCEPT_FILE_MESSAGE,
  MAX_FILE_SIZE,
} from '@/constants'
import { useAuth } from '@/hooks/query/auth'

import { DeleteIcon, LoadingIcon, PlusIcon } from '@/components/icons'

import { getUploadFileType } from '@/utils/helper/file'
import { checkAspectRatio, getURLOrBase64, getUrlFromUploadResponse } from '@/utils/helper/image'

const UPLOAD_PATH = `${API_ROOT}${API.UPLOAD}`

const DeleteButton = ({ onClick }) => {
  return (
    <div className="hover:bg-black/30 text-sub-blue group-hover:flex-center absolute right-0 top-0 hidden h-6 w-6 cursor-pointer rounded-full bg-opacity-50 transition-colors">
      <DeleteIcon onClick={onClick} />
    </div>
  )
}

export const UploadFileTrigger = ({ image, loading, hasDelete, onDelete, disabled }) => {
  if (!image) {
    return (
      <div>
        {loading ? <LoadingIcon /> : <PlusIcon />}
        <div className="mt-2">Upload</div>
      </div>
    )
  }

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg">
      <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" />
      {hasDelete && onDelete && !disabled ? <DeleteButton onClick={onDelete} /> : null}
    </div>
  )
}

const UploadFile = (props, ref) => {
  const {
    accept = ACCEPT_UPLOAD_FILE_TYPE.IMAGE,
    maxSize = MAX_FILE_SIZE,
    isUploadFirst = false,
    hasDelete = true,
    onChangeFile,
    aspectRatio,
    disabled,
    value: image,
    fileName,
    setFileName,
    rootClassName,
    ratioText = '375 x 212',
  } = props

  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const authorization = useMemo(() => (token ? `Bearer ${token}` : null), [token])

  const fileType = useMemo(() => getUploadFileType(accept), [accept])

  const beforeUpload = async (file) => {
    // eslint-disable-next-line no-console
    console.info(file)

    const isAcceptFile = accept.includes(file.type)
    const isLtMaxFileSize = file.size <= maxSize * 1024 * 1024

    if (!isAcceptFile) {
      message.error(ERROR_ACCEPT_FILE_MESSAGE[fileType] || ERROR_ACCEPT_FILE_MESSAGE.DEFAULT)
      return false
    }

    if (!isLtMaxFileSize) {
      message.error(`${maxSize}MB未満のファイルをアップロードしてください。`)
      return false
    }

    // // Check the origin of the image based on the creation date
    // const createdDate = file?.lastModified // Creation date of the file
    // const currentDate = Date.now() // Current date

    // // Set a minimum time difference (e.g., 30 seconds) to determine if the image is recently captured from the camera
    // const minimumTimeDifference = 30000 // 30 seconds

    // if (createdDate && currentDate - createdDate < minimumTimeDifference) {
    //   message.error('ギャラリーからの画像のみ選択できます。')
    //   return false
    // }

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
    const { status, response, name } = file || {}

    // if (isUploadFirst) {
    //   setLoading(true)
    //   onChangeFile?.(file.originFileObj)

    //     const reader = new FileReader()
    //     reader.readAsDataURL(file.originFileObj)
    //     reader.onloadend = () => {
    //       setLoading(false)
    //     }
    //     return
    // }

    if (status === 'uploading') {
      setLoading(true)
    }

    if (status === 'done') {
      setLoading(false)
      setFileName?.(name)

      const url = await getUrlFromUploadResponse(response, file)
      onChangeFile?.(url)
    }

    if (status === 'error') {
      message.error('アップロードに失敗しました。')
      setLoading(false)
    }
  }

  const getUploadAction = (file) => {
    if (isUploadFirst) {
      return getURLOrBase64(file, true)
    }
    return UPLOAD_PATH
  }

  const onDelete = (e) => {
    if (!hasDelete) return
    e?.stopPropagation?.()
    onChangeFile?.('')
  }

  return (
    <div className={rootClassName}>
      <Upload
        ref={ref}
        name="upload"
        multiple={false}
        listType="picture-card"
        beforeUpload={beforeUpload}
        onChange={handleUploadChange}
        disabled={disabled || loading}
        headers={{ authorization }}
        action={getUploadAction}
        showUploadList={false}
        accept={accept}
      >
        <UploadFileTrigger {...{ image, fileName, loading, hasDelete, onDelete, disabled }} />
      </Upload>
    </div>
  )
}

export default forwardRef(UploadFile)

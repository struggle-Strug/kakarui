import { UPLOAD_FILE_TYPE } from '@/constants'

export const getUploadFileType = (accept) => {
  const type = Object.keys(UPLOAD_FILE_TYPE).find((key) => accept.includes(UPLOAD_FILE_TYPE[key]))
  if (!type || !accept) return null

  return UPLOAD_FILE_TYPE[type]
}

export const getFileNameFromUrl = (url = '') => {
  if (url === '') {
    return 'default_image.png'
  }
  return url ? url.substring(url.lastIndexOf('/') + 1) : ''
}

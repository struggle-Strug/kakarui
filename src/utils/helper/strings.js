import chunk from 'lodash/chunk'
import truncate from 'lodash/truncate'

import { MAX_LEN_CONTENT, MAX_LEN_USERNAME } from '@/constants'

export const truncateText = (text, length = MAX_LEN_CONTENT) => truncate(text, { length })

export const truncateUsername = (username, len = MAX_LEN_USERNAME) => truncateText(username, len)

export const isHTML = (str) => {
  const document = new DOMParser().parseFromString(str, 'text/html')
  return Array.from(document.body.childNodes).some((node) => node.nodeType === 1)
}

export const splitTextIntoChunks = (text = '', chunkLength = 54) =>
  chunk(text, chunkLength)
    .map((c) => c.join(''))
    .join('\n')

export const handleKeyDown = (e, onSubmit = () => {}) => {
  const keyCode = e.which || e.keyCode
  if (keyCode === 13 && !e.shiftKey) {
    e.preventDefault()
    onSubmit()
  }
}

export const stringifyJsonData = (text) => (text ? JSON.stringify(text, null, 2) : '')

export const removeQuotes = (str) => {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1)
  }
  return str
}

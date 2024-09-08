/* eslint-disable no-console */
import { message } from 'antd'

import { useCallback, useState } from 'react'

export function useCopyToClipboard(showSuccessMessage = true) {
  const [copiedText, setCopiedText] = useState(null)

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      if (showSuccessMessage) {
        message.success('コピー完了しました。')
      }
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }, [])

  return [copiedText, copy]
}

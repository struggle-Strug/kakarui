import { useRef } from 'react'

import { showAPIErrorMessage } from '@/utils/helper/message'

export function useShowErrorOnce(query, errorType) {
  const errorShownRef = useRef(false)

  if (query.isError && query.error && !errorShownRef.current) {
    showAPIErrorMessage(query.error, errorType)
    errorShownRef.current = true
  }
}

import { useRouter } from 'next/router'

import { useMockApiEnabled } from './useMockApiEnabled'

export const useMockApiError = () => {
  const router = useRouter()
  const { mockApiEnabled } = useMockApiEnabled()

  const { status_code: statusCode, error_code: errorCode } = router.query || {}

  if (mockApiEnabled) {
    if (statusCode) {
      return { status_code: Number(statusCode) }
    }

    if (errorCode) {
      return { error_code: errorCode }
    }
  }

  return {}
}

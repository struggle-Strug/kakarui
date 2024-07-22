import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRemovePageAndPageSize = (open) => {
  const router = useRouter()

  useEffect(() => {
    if (!open) {
      const { page, pageSize, ...query } = router.query || {}
      router.replace({ query })
    }
  }, [open])
}

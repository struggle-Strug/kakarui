import { useState } from 'react'

export const useLoadingSimulation = (initialLoading = false, delay = 1000) => {
  const [loading, setLoading] = useState(initialLoading)

  const startLoading = (callback) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // eslint-disable-next-line no-unused-expressions
      callback && callback()
    }, delay)
  }

  return [loading, startLoading]
}

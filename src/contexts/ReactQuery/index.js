import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { useState } from 'react'

import { DEBUG, httpStatusCode } from '@/constants'

const RQ_DEFAULT_QUERIES_OPTIONS = {
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
  staleTime: 5000,
}

export const ReactQueryProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: RQ_DEFAULT_QUERIES_OPTIONS,
          suspense: true,
          cacheTime: 0,
          retry: (failureCount, error) => {
            if (
              error?.code === 'ERR_BAD_RESPONSE' ||
              [httpStatusCode.INTERNAL_SERVER_ERROR].includes(error?.response?.status)
            ) {
              return true
            }
            return false
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {DEBUG && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />}
    </QueryClientProvider>
  )
}

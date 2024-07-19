import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { useState } from 'react'

import { DEBUG } from '@/constants'

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

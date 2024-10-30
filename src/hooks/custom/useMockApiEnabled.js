import { LOCAL_STORAGE_KEYS } from '@/constants'
import { useSyncLocalStorage } from '@/hooks/share'

export const useMockApiEnabled = () => {
  const [mockApiStatus, setMockApiStatus] = useSyncLocalStorage(LOCAL_STORAGE_KEYS.MOCK_API, 'off')

  return {
    mockApiEnabled: mockApiStatus === 'on',
    setMockApiEnabled: (enabled) => setMockApiStatus(enabled ? 'on' : 'off'),
  }
}

import { LOCAL_STORAGE_KEYS } from '@/constants'
import { useSyncLocalStorage } from '@/hooks/share'

export const useStubEnabled = () => {
  const [stubStatus, setStubStatus] = useSyncLocalStorage(LOCAL_STORAGE_KEYS.STUB, 'off')

  return {
    stubEnabled: stubStatus === 'on',
    setStubEnabled: (enabled) => setStubStatus(enabled ? 'on' : 'off'),
  }
}

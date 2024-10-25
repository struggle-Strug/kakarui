import { LOCAL_STORAGE_KEYS } from '@/constants'
import { useSyncLocalStorage } from '@/hooks/share'

export const useOrganizationActive = () => {
  const [orgActive, setOrgActive] = useSyncLocalStorage(LOCAL_STORAGE_KEYS.ORGANIZATION_ID, {})
  return {
    orgActiveId: orgActive?.id,
    orgActive,
    setOrgActive,
  }
}

export const useOrganizationQuery = () => {
  const [organizations, setOrganizations] = useSyncLocalStorage(
    LOCAL_STORAGE_KEYS.ORGANIZATIONS,
    []
  )

  const [organizationDetail, setOrganizationDetail] = useSyncLocalStorage(
    LOCAL_STORAGE_KEYS.ORGANIZATIONS_DETAIL
  )

  const [organizationId, setOrganizationId] = useSyncLocalStorage(
    LOCAL_STORAGE_KEYS.ORGANIZATION_ID
  )

  return {
    organizations,
    setOrganizations,
    //
    organizationDetail,
    setOrganizationDetail,
    //
    organizationId,
    setOrganizationId,
    //
    organizationName: organizationDetail?.organization_name || organizationDetail?.name || '',
  }
}

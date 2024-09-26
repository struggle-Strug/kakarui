export const PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
export const TESTING = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'
export const DEV = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'

export const STALE_TIME = 60_000 // 1 minute

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 20

export const DEFAULT_PAGE_MENU = 1
export const DEFAULT_PAGE_SIZE_MENU = 5

export const MS_IN_DAY = 1000 * 60 * 60 * 24

export const USER_ROLE = {
  SYSTEM_ADMIN: 'system_admin', // SystemAdmin
  SITE_ADMIN: 'site_admin', // SiteAdmin
  ORG_ADMIN: 'org_admin', // OrgAdmin
  MEMBER: 'member', // Member
  DEPLOY_ADMIN: 'deploy_admin', // DeployAdmin
}

export const LOCAL_STORAGE_KEYS = {
  STUB: 'stub', // on/off
  MOCK_API: 'mock-api', // on/off
  USER: 'user',
  ORGANIZATIONS: 'organizations',
  ORGANIZATIONS_DETAIL: 'organization-detail',
  ORGANIZATION_ID: 'organization-id',
  PROJECT: 'project',
  ROBOT: 'robot',
}

export const EXPIRED_URL = {
  TIME: Number(process.env.NEXT_PUBLIC_EXPIRE_TIME || 1),
  UNIT: process.env.NEXT_PUBLIC_EXPIRE_TIME_UNIT || 'hours',
}

export const MAX_LENGTH_LOG_TAIL = Number(process.env.NEXT_PUBLIC_MAX_LENGTH_LOG_TAIL || 10000)

export const JapaneseRegex = /[ぁ-んァ-ン々〆〤一-龯]/

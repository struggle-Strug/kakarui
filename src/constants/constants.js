export const PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
export const DEBUG = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'
export const DEV = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'

export const STALE_TIME = 5000

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 20

export const MS_IN_DAY = 1000 * 60 * 60 * 24

export const USER_ROLE = {
  SYSTEM_ADMIN: 'system_admin', // SystemAdmin
  SITE_ADMIN: 'site_admin', // SiteAdmin
  ORG_ADMIN: 'org_admin', // OrgAdmin
  MEMBER: 'member', // Member
  DEPLOY_ADMIN: 'deploy_admin', // DeployAdmin
}

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
  ORGANIZATIONS: 'organizations',
  ORGANIZATIONS_DETAIL: 'organization-detail',
  ORGANIZATION_ID: 'organization-id',
  PROJECT: 'project',
  ROBOT: 'robot',
}

export const DEFAULT_ORGANIZATION_ID = 'b53e56d4-125c-42c2-90e0-2b4b17e085fd'

export const DEFAULT_PROJECT = {
  create_date: '2024-07-19T07:12:08.972663',
  create_user: 'ad3a7c48-8592-4002-a189-e874e40235e4',
  description: '結合試験用プロジェクトです。',
  id: 'fe694977-83a5-4ab7-99b4-2e0aded1b4fe',
  name: '結合試験用プロジェクト',
  organization_id: 'b53e56d4-125c-42c2-90e0-2b4b17e085fd',
  update_date: '2024-07-19T07:12:08.972663',
  update_user: 'ad3a7c48-8592-4002-a189-e874e40235e4',
}

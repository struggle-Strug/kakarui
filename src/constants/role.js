import { USER_ROLE } from './constants'
import Routes from './routes'

// docs: https://docs.google.com/spreadsheets/d/11KxmW2bCESWTBWYsX_-6MHwe_LAftxUrAdOHPfnKT4c/edit?gid=0#gid=0
export const USER_ROLE_PAGES = {
  [USER_ROLE.SYSTEM_ADMIN]: [
    Routes.DEPLOY,
    Routes.DEPLOY_MOVIE_SHOW,
    Routes.DEPLOY_MOVIE_SHOW_DETAIL,
    Routes.DEPLOY_LOG_SHOW,
    Routes.DEPLOY_LOG_SHOW_DETAIL,
    Routes.USER,
    Routes.PROJECT,
    Routes.PROJECT_DETAIL,
    Routes.MODULE,
    Routes.MODULE_DETAIL,
    Routes.MODULE_SET,
    Routes.MODULE_SET_CREATE,
    Routes.MODULE_SET_DETAIL,
    Routes.MODULE_CONFIG,
    Routes.MODULE_CONFIG_CREATE,
    Routes.MODULE_CONFIG_DETAIL,
  ],
  [USER_ROLE.ORG_ADMIN]: [
    Routes.DEPLOY,
    Routes.DEPLOY_MOVIE_SHOW,
    Routes.DEPLOY_MOVIE_SHOW_DETAIL,
    Routes.DEPLOY_LOG_SHOW,
    Routes.DEPLOY_LOG_SHOW_DETAIL,
    Routes.USER,
    Routes.PROJECT,
    Routes.PROJECT_DETAIL,
    Routes.MODULE,
    Routes.MODULE_DETAIL,
    Routes.MODULE_SET,
    Routes.MODULE_SET_CREATE,
    Routes.MODULE_SET_DETAIL,
    Routes.MODULE_CONFIG,
    Routes.MODULE_CONFIG_CREATE,
    Routes.MODULE_CONFIG_DETAIL,
  ],
  [USER_ROLE.MEMBER]: [
    Routes.DEPLOY_MOVIE_SHOW,
    Routes.DEPLOY_MOVIE_SHOW_DETAIL,
    Routes.DEPLOY_LOG_SHOW,
    Routes.DEPLOY_LOG_SHOW_DETAIL,
    Routes.USER,
    Routes.PROJECT,
    Routes.PROJECT_DETAIL,
  ],
  [USER_ROLE.DEPLOY_ADMIN]: [
    Routes.DEPLOY,
    Routes.DEPLOY_MOVIE_SHOW,
    Routes.DEPLOY_MOVIE_SHOW_DETAIL,
    Routes.DEPLOY_LOG_SHOW,
    Routes.DEPLOY_LOG_SHOW_DETAIL,
    Routes.USER,
    Routes.PROJECT,
    Routes.PROJECT_DETAIL,
  ],
}

export const MEMBER_ROLE_BLOCKED_PAGES = [Routes.USER]

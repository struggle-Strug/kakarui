export default {
  AUTH: {
    LOGIN: '/',
  },

  HOME: '/home',

  USER: '/user-manage',

  SITEDATA: '/sitedata-management',

  MODULE: '/module-manage',
  MODULE_DETAIL: '/module-manage/[module_id]',

  MODULE_SET: '/moduleset-manage',
  MODULE_SET_CREATE: '/moduleset-add',
  MODULE_SET_DETAIL: '/moduleset-manage/[module_set_id]',
  MODULE_SET_DELETE: '/moduleset-manage/[module_set_id]/delete',

  MODULE_CONFIG: '/moduleconfig-manage',
  MODULE_CONFIG_CREATE: '/module-config-add',
  MODULE_CONFIG_DETAIL: '/moduleconfig-manage/[module_config_id]',
  MODULE_CONFIG_DELETE: '/moduleconfig-manage/[module_config_id]/delete',
  SEQUENCE_CONFIG_CREATE: '/editor/[project_id]/[module_config_id]',

  PROJECT: '/project-manage',
  PROJECT_DETAIL: '/project-manage/[project_id]',

  DEPLOY: '/deploy-manage',

  DEPLOY_MOVIE_SHOW: '/movie-show',
  DEPLOY_MOVIE_SHOW_DETAIL: '/movie-show/[deploy_id]',

  DEPLOY_LOG_SHOW: '/log-show',
  DEPLOY_LOG_SHOW_DETAIL: '/log-show/[deploy_id]',

  CHECK: '/Check',

  LOW_CODE_EDITOR: '/editor/[project_id]/[module_config_id]',
  LOW_CODE_EDITOR_EDIT: '/editor/[project_id]/[module_config_id]/[sequence_id]',

  NOT_FOUND: '/404',
}

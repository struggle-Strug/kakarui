export const API_ROOT = process.env.NEXT_PUBLIC_HOST
export const SOCKET_IO = process.env.NEXT_PUBLIC_SERVER_URL
export const ROOT_URL = process.env.NEXT_PUBLIC_WEB_URL
export const API_ADMIN_PREFIX = 'admin'

export const TIMEOUT = 15000

export default {
  API_ROOT,
  TIMEOUT,

  TAG: '/tag',
  UPLOAD: `upload`,

  AUTH: {
    ADMIN_LOGIN: 'auth/admin',
    FORGET_PASSWORD: 'auth/admin_forget_password',
    RESET_PASSWORD: 'auth/admin_reset_password',
  },

  // Flow by https://github.com/agecodeVN/etk-api/tree/main/doc/interface/external
  // -- START --
  USER: {
    LIST: '/users',
    DETAIL: '/users/{user_id}',
    CREATE: '/users/user_create', // POST
    UPDATE: '/users/{user_id}', // PUT
    BY_ORGANIZATION: '/organizations/{organization_id}/users/',
  },

  MODULE: {
    LIST: '/organizations/{organization_id}/modules',
    CREATE: '/organizations/{organization_id}/modules', // POST
    UPDATE: '/organizations/{organization_id}/modules/{module_id}', // PUT
  },

  MODULE_CONFIG: {
    LIST: '/organizations/{organization_id}/projects/{project_id}/module-configs', // POST
    CREATE: '/organizations/{organization_id}/Projects/{project_id}/module-configs', // POST
    UPDATE:
      '/organizations/{organization_id}/projects/{project_id}/module-configs/{module_config_id}', // PUT
  },

  MODULE_SET: {
    LIST: '/organizations/{organization_id}/modules',
    CREATE: '/organizations/{organization_id}/module-sets', // POST
    UPDATE: '/organizations/{organization_id}/module-sets/{module_set_id}', // PUT
  },

  DEPLOY: {
    LIST: '/organizations/{organization_id}/projects/{project_id}/deploys',
    START: '/organizations/{organization_id}/projects/{project_id}/deploy', // POST
  },

  PROJECT: {
    LIST: '/organizations/{organization_id}/projects',
    CREATE: '/organizations/{organization_id}/projects', // POST
    UPDATE: '/organizations/{organization_id}/projects/{project_id}', // PUT
  },

  PERMISSION: {
    CREATE: '/organizations/{organization_id}/users/{user_id}/permission', // POST
    UPDATE: '/organizations/{organization_id}/users/{user_id}/permission/{organization_user_id}', // PUT
  },

  ROBOT: {
    LIST: '/organizations/{organization_id}/robots',
  },
  // -- END --
}

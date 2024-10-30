export const API_ROOT = process.env.NEXT_PUBLIC_HOST
export const ROOT_URL = process.env.NEXT_PUBLIC_WEB_URL
export const API_ADMIN_PREFIX = 'admin'

export const TIMEOUT = 30000

export const API = {
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
    BY_ORGANIZATION: '/organizations/{organization_id}/users',
    DELETE: '/users/{user_id}',
  },

  SITELISTS: {
    LIST: '/sites',
    SITEDATA: '/sites/{site_id}/site-data', //GET
    CREATE: '/sites/{site_id}/site-data', //POST
    UPDATA: '/sites/{site_id}/site-data/{data_id}' //PUT
  },

  MODULE: {
    LIST: '/organizations/{organization_id}/modules',
    CREATEURL: '/organizations/{organization_id}/modules', // POST
    CREATEUPLOAD: '{baseUrl}/{module_upload_id}_{architecture}.tar?{queryParams}', // PUT
    UPDATEURL: '/organizations/{organization_id}/modules/{module_id}', // PUT
    UPDATEUPLOAD: '{baseUrl}/{module_upload_id}-{architecture}.tar?{queryParams}/{module_id}', // PUT
    DELETE: '/organizations/{organization_id}/modules/{module_id}', // DELETE
  },

  MODULE_CONFIG: {
    LIST: '/organizations/{organization_id}/projects/{project_id}/module-configs', // POST
    CREATE: '/organizations/{organization_id}/projects/{project_id}/module-configs', // POST
    UPDATE:
      '/organizations/{organization_id}/projects/{project_id}/module-configs/{module_config_id}', // PUT
    DELETE:
      '/organizations/{organization_id}/projects/{project_id}/module-configs/{module_config_id}', // DELETE
  },

  MODULE_SEQUENCES_CONFIG: {
    LIST: '/organizations/{organization_id}/projects/{project_id}/module-configs/{module_config_id}/sequences', // POST
  },
  
  MODULE_SET: {
    LIST: '/organizations/{organization_id}/module-sets',
    DETAIL: '/organizations/{organization_id}/module-sets/{module_set_id}', // GET
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
    DELETE: '/organizations/{organization_id}/projects/{project_id}',
  },

  PROJECTDATA: {
    LIST: '/organizations/{organization_id}/projects/{project_id}/project-data',
    CREATE: '/organizations/{organization_id}/projects/{project_id}/project-data', // POST
    UPDATE: '/organizations/{organization_id}/projects/{project_id}/project-data/{data_id}', // PUT
    DELETE: '/organizations/{organization_id}/projects/{project_id}',
  },

  PERMISSION: {
    CREATE: '/organizations/{organization_id}/users/{user_id}/permission', // POST
    UPDATE: '/organizations/{organization_id}/users/{user_id}/permission/{organization_user_id}', // PUT
    DELETE: '/organizations/{organization_id}/users/{user_id}/permission',
  },

  ROBOT: {
    LIST: '/organizations/{organization_id}/robots',
  },

  FILE: {
    URL_CREATE: '/storages/{storage_name}/url', // POST
  },
  NOTIFICATION: "/users/{entra_id}/notification", //PUT
  SKILL: {
    LIST: '/organizations/{organization_id}/skills',
  },

  SEQUENCE: {
    CREATE:
      '/organizations/{organization_id}/projects/{project_id}/module-configs/{module_config_id}/sequences',
  },

  PROJECT_DATA: {
    LIST: '/organizations/{organization_id}/projects/{project_id}/project-data',
  },
  SITE_DATA: {
    LIST: '/sites/{site_id}/site-data',
  },
  // -- END --
}

export const API_MOCK = {
  DEPLOY_LIST: 'https://karakuri.agecode.dev/deploys',
  URL_CREATE: 'https://karakuri.agecode.dev/storages/{storage_name}/url',
}

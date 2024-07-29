import { UPLOAD_FILE_TYPE } from './image'

export const ERROR_CODE = {
  INVALID_USER: 'INVALID_USER',
  PHONE_PASSWORD_FULLNAME_IS_REQUIRED: 'PHONE_PASSWORD_FULLNAME_IS_REQUIRED',
  USERNAME_OR_EMAIL_EXISTED: 'USERNAME_OR_EMAIL_EXISTED',
  EMAIL_ALREADY_EXIST: 'EMAIL_ALREADY_EXIST',
  USER_NOT_ACTIVE: 'USER_NOT_ACTIVE',
  CODE_EXIST: 'CODE_EXIST',
}

export const ERROR_MESSAGE = {
  [ERROR_CODE.USERNAME_OR_EMAIL_EXISTED]:
    '管理者名又はメールアドレスはシステム上に存在しています。',
  [ERROR_CODE.USER_NOT_ACTIVE]: 'このアカウントは無効化されました。',
  [ERROR_CODE.CODE_EXIST]: 'すでに登録済みのコードです。別のコードを登録してください。',
  [ERROR_CODE.INVALID_USER]: 'ログイン情報が正しくありません。',
}

export const ERROR_ACCEPT_FILE_MESSAGE = {
  [UPLOAD_FILE_TYPE.IMAGE]: 'PNGまたはJPGファイルをアップロードしてください。',
  [UPLOAD_FILE_TYPE.PDF]: 'PDFファイルをアップロードしてください。',
  [UPLOAD_FILE_TYPE.AUDIO]: '音声ファイルをアップロードしてください。',
  [UPLOAD_FILE_TYPE.DEFAULT]: 'サポートされていないファイルタイプです。',
}

export const API_ERROR_CODE = {
  E40002: 'E40002',
  E40101: 'E40101',
  E50001: 'E50001',
  E50004: 'E50004',
  E50005: 'E50005',
  E50007: 'E50007',
  E50013: 'E50013',
  E50014: 'E50014',
  E50016: 'E50016',
  E40301: 'E40301',
  E40401: 'E40401',
  E50006: 'E50006',
  E50015: 'E50015',
  E50021: 'E50021',
  E50022: 'E50022',
  E50018: 'E50018',
  E50019: 'E50019',
  E50020: 'E50020',
  E50017: 'E50017',
}

export const API_ERRORS = {
  USER_CREATE: 'USER_CREATE',
  USER_LIST: 'USER_LIST',
  USER_UPDATE: 'USER_UPDATE',
  DEPLOY_START: 'DEPLOY_START',
  DEPLOY_LIST: 'DEPLOY_LIST',
  DEPLOY_STATUS: 'DEPLOY_STATUS',
  ROBOT_LIST: 'ROBOT_LIST',
  PROJECT_CREATE: 'PROJECT_CREATE',
  PROJECT_LIST: 'PROJECT_LIST',
  PROJECT_UPDATE: 'PROJECT_UPDATE',
  PERMISSION_ADD: 'PERMISSION_ADD',
  PERMISSION_UPDATE: 'PERMISSION_UPDATE',
}

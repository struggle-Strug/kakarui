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

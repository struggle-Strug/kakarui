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

export const API_ERROR_MESSAGES = {
  USER: {
    [API_ERROR_CODE.E40002]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E40101]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50001]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50004]: '{項目名}を入力してください。',
    [API_ERROR_CODE.E50005]: '{項目名}の形式を正しく入力してください。',
    [API_ERROR_CODE.E50007]: '{文字数}文字以下を入力してください。',
    [API_ERROR_CODE.E50013]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50014]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50016]:
      '同名の氏名またはメールアドレスが存在します。氏名またはメールアドレスを変更してください。',
    [API_ERROR_CODE.E40301]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E40401]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50006]: '-',
    [API_ERROR_CODE.E50015]: '',
    [API_ERROR_CODE.E50021]: '',
    [API_ERROR_CODE.E50022]: '',
    [API_ERROR_CODE.E50018]: 'IoTEdge接続関連異常：異常',
    [API_ERROR_CODE.E50019]: 'IoTEdge接続関連異常：異常',
    [API_ERROR_CODE.E50020]: 'リンク作成が衝突されました。',
    [API_ERROR_CODE.E50017]: '',
  },
  PROJECT: {
    [API_ERROR_CODE.E40002]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E40101]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50001]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50004]: '{項目名}を入力してください。',
    [API_ERROR_CODE.E50005]: '{項目名}の形式を正しく入力してください。',
    [API_ERROR_CODE.E50007]: '{文字数}文字以下を入力してください。',
    [API_ERROR_CODE.E50013]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50014]: 'IoTEdge接続関連異常：異常',
    [API_ERROR_CODE.E50016]:
      '同名の氏名またはメールアドレスが存在します。氏名またはメールアドレスを変更してください。',
    [API_ERROR_CODE.E40301]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E40401]: 'サーバー側で問題が発生しました。',
    [API_ERROR_CODE.E50006]: '-',
    [API_ERROR_CODE.E50015]: '',
    [API_ERROR_CODE.E50021]: '',
    [API_ERROR_CODE.E50022]: '',
    [API_ERROR_CODE.E50018]: 'IoTEdge接続関連異常：異常',
    [API_ERROR_CODE.E50019]: 'IoTEdge接続関連異常：異常',
    [API_ERROR_CODE.E50020]: 'リンク作成が衝突されました。',
    [API_ERROR_CODE.E50017]: '',
  },
}

import { USER_ROLE } from './constants'
import { ACTIVE_STATUS, DEPLOY_STATUS, USER_STATUS } from './status'
import { DEPLOYMENT_TYPE, GENDER_TYPE, SORT_TYPE } from './types'

export const APP_NAME = 'Karakuri Admin Dashboard'

export const EMPTY_TEXT = '指定なし'

export const NOT_SET_AGE = '年齢未設定'

export const PLACEHOLDER_INPUT = '入力してください。'
export const PLACEHOLDER_SELECT = '選択してください。'

export const SORT_TYPE_TEXT = {
  [SORT_TYPE.ASC]: '上昇',
  [SORT_TYPE.DESC]: '降順',
}

export const GENDER_TEXT = {
  [GENDER_TYPE.MALE]: '男性',
  [GENDER_TYPE.FEMALE]: '女性',
}

export const USER_STATUS_TEXT = {
  [USER_STATUS.ACTIVE]: '有効',
  [USER_STATUS.BANNED]: '禁止中',
}

export const DEPLOY_STATUS_TEXT = {
  [DEPLOY_STATUS.COMPLETE]: '正常終了',
  [DEPLOY_STATUS.IN_PROGRESS]: '実行中',
  [DEPLOY_STATUS.PENDING]: '異常終了',
}

export const USER_ROLE_TEXT = {
  [USER_ROLE.SYSTEM_ADMIN]: 'システム管理者',
  [USER_ROLE.SITE_ADMIN]: '現場管理者',
  [USER_ROLE.ORG_ADMIN]: '組織管理者',
  [USER_ROLE.MEMBER]: '開発者',
  [USER_ROLE.DEPLOY_ADMIN]: 'デプロイ管理者',
}

export const ACTIVE_STATUS_TEXT = {
  [ACTIVE_STATUS.ENABLE]: '有効',
  [ACTIVE_STATUS.DISABLE]: '無効',
}

export const DEPLOYMENT_TYPE_TEXT = {
  [DEPLOYMENT_TYPE.ROBOT]: '実機',
  [DEPLOYMENT_TYPE.SIM]: 'Sim環境',
}

import {
  ACTIVE_STATUS_TEXT,
  DEPLOYMENT_TYPE_TEXT,
  GENDER_TEXT,
  SORT_TYPE_TEXT,
  USER_ROLE_TEXT,
} from './texts'

export const SORT_OPTIONS = Object.keys(SORT_TYPE_TEXT).map((value) => ({
  label: SORT_TYPE_TEXT[value],
  value,
}))

export const GENDER_OPTIONS = Object.keys(GENDER_TEXT).map((value) => ({
  label: GENDER_TEXT[value],
  value,
}))

export const USER_ROLE_OPTIONS = Object.keys(USER_ROLE_TEXT).map((value) => ({
  label: USER_ROLE_TEXT[value],
  value,
}))

export const ACTIVE_STATUS_OPTIONS = Object.keys(ACTIVE_STATUS_TEXT).map((value) => ({
  label: ACTIVE_STATUS_TEXT[value],
  value,
}))

export const DEPLOYMENT_TYPE_OPTIONS = Object.keys(DEPLOYMENT_TYPE_TEXT).map((value) => ({
  label: DEPLOYMENT_TYPE_TEXT[value],
  value,
}))

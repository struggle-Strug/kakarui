import { message } from 'antd'
import get from 'lodash/get'

import { errorMessage as errorMessageData } from '@/services/error-message'

// -- API ERROR MESSAGE --
/**
 * @param {string} errorMessage - The original error message.
 * @param {Object} params - The parameters to replace (eg: { name: 'value', count: 10 }).
 * @returns {string} The formatted error message.
 */

export function formatErrorMessage(errorMessage, params = {}) {
  if (Object.keys(params).length > 0) {
    return Object.keys(params).reduce((current, key) => {
      return current.replace(`{${key}}`, params[key])
    }, errorMessage)
  }

  return errorMessage
}

const getErrorMessage = (errorKey, errorCode, params = {}) => {
  const apiErrorMessage = errorMessageData.api_error_message || {}

  const errorMessageByKey = apiErrorMessage?.[errorKey]?.[errorCode]
  const errorMessageByCommon = apiErrorMessage.COMMON?.[errorCode]
  const errorMessageDefault = 'サーバー側で問題が発生しました。'

  const errorMessage = errorMessageByKey || errorMessageByCommon || errorMessageDefault
  return formatErrorMessage(errorMessage, params)
}

export function showAPIErrorMessage(error, errorKey, params = {}) {
  const errorCode = get(error, 'response.data.error_code')
  const errorMessage = getErrorMessage(errorKey, errorCode, params)
  message.error(errorMessage)
}

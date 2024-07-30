import { message } from 'antd'
import dayjs from 'dayjs'
import get from 'lodash/get'

import { API_ERRORS } from '@/constants'
import { FORMAT_STRING } from '@/constants/time'

import { errorMessage as errorMessageData } from '@/services/error-message'

export const groupedDays = (_messages = []) => {
  return (
    _messages?.reduce((acc, el) => {
      const messageDay = dayjs(el.created).format(FORMAT_STRING.date_minus)
      if (el.type === 'day') return { ...acc }
      if (acc[messageDay]) {
        return { ...acc, [messageDay]: acc[messageDay].concat([el]) }
      }
      return { ...acc, [messageDay]: [el] }
    }, {}) || {}
  )
}

export function generateMessages(_messages) {
  const days = groupedDays(_messages)
  const sortedDays = Object.keys(days).sort(
    (x, y) => dayjs(y, FORMAT_STRING.date_minus).unix() - dayjs(x, FORMAT_STRING.date_minus).unix()
  )

  return sortedDays.reduce((acc, date) => {
    const sortedMessages = days[date].sort((x, y) => new Date(y.created) - new Date(x.created))

    return acc.concat([...sortedMessages, { type: 'day', date, id: date }])
  }, [])
}

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

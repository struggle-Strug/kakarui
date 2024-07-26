import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import keyBy from 'lodash/keyBy'
import pick from 'lodash/pick'
import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
import uniqWith from 'lodash/uniqWith'
import { twMerge } from 'tailwind-merge'
import { v4 as uuid } from 'uuid'

// --- Common ---
export function uuidv4() {
  return uuid()
}

export function cn(...inputs) {
  return twMerge(classNames(inputs))
}

export function tryParseJson(json) {
  try {
    return JSON.parse(json) || {}
  } catch {
    return {}
  }
}

export const tryParseBoolean = (value) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return false
  }
}

export function mergeRefs(refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ref.current = value
      }
    })
  }
}

// --- Custom ---
export const sortByKey = (array, key) => {
  return (array || []).sort((a, b) => (a[key] || 0) - (b[key] || 0))
}

export const filterKey = (arr, keys, key = 'name') => {
  return (arr || []).filter((item) => keys?.includes?.(item?.[key]))
}

export const joinKey = (arr, key = 'name', separator = '、') =>
  (arr || []).map((item) => item?.[key] || item).join(separator)

export const checkDuplicateByKey = (array, key) => {
  const uniqueValues = new Set()
  return (array || []).some((item) => {
    const value = item[key]
    if (uniqueValues.has(value)) {
      return true
    }
    uniqueValues.add(value)
    return false
  })
}

export const filterNull = (v) => !isNull(v)

export const uniqueArray = (arr, keys) => {
  const result = uniqWith(arr, (a, b) => keys.every((key) => a[key] === b[key]))

  const mergedResult = result.map((item) => {
    const total = arr.reduce((count, obj) => {
      return keys.every((key) => obj[key] === item[key]) ? count + 1 : count
    }, 0)

    return { ...item, total }
  })

  return mergedResult
}

export const parseArrayToObjectKeyValue = (array, keyField, valueField) => {
  return (array || []).reduce((result, item) => {
    result[item[keyField]] = item[valueField]
    return result
  }, {})
}

export const extractKey = (arr = [], key = 'id') => (arr || []).map((e) => e?.[key]).filter(Boolean)

export const removeItemByIndex = (array, index) =>
  index >= 0 && index < array.length ? [...array.slice(0, index), ...array.slice(index + 1)] : array

export const keyByTextQuery = (res) => keyBy(res?.results || res || [], 'id')

export const mapOptionsQuery = (arr, key1 = 'name', key2 = 'id') =>
  (arr || []).map(({ [key1]: label, [key2]: value } = {}) => ({
    key: value,
    label,
    value,
  }))

export const getValidArrayOrFallback = (array, fallbackValue = []) => {
  return array?.length > 0 ? array : fallbackValue
}

// --- Business ---
export const filterOption = (input, option) => {
  if (typeof input !== 'object') return false
  return (option?.value || '')?.toLowerCase?.().includes?.(input?.toLowerCase?.())
}

export const getSearchOptions = (data = [], fields = []) => {
  if (isEmpty(data) || isEmpty(fields)) return []
  let options = []
  data.forEach((item) => {
    const fieldOption = pick(item, fields)
    options = [...options, ...Object.values(fieldOption)]
  })
  options = sortBy(uniqBy(options))
  return options.map((value) => ({ value }))
}

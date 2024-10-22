import dayjs from 'dayjs'

import { FORMAT_STRING } from '@/constants'

import { TIMEZONE } from '@/libs/dayjs'

export const compareDate = (date) => {
  if (dayjs().isSame(date)) {
    return 0
  }
  if (dayjs().isBefore(date)) {
    return -1
  }
  return 1
}

export const getAge = (birthday) => (birthday ? dayjs().year() - dayjs(birthday).year() : '')

export const getDiff = (date1, date2, unit = 'h', float = false) =>
  dayjs(date1).diff(dayjs(date2), unit, float)

export const formatDate = (date, formatString = FORMAT_STRING.date_str) =>
  date ? dayjs.utc(date).tz(TIMEZONE).format(formatString) : ''

export const formatBirthday = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '')

export const disabledDate = (d) => dayjs(d).isAfter(dayjs())

export const disabledBirthdayPicker = (d) => dayjs(d).isAfter(dayjs().subtract(18, 'year'))

export const isSameTimeUnit = (date1, date2, unit = 'day') =>
  dayjs(date1).isSame(dayjs(date2), unit)

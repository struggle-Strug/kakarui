import dayjs from 'dayjs'

import { FORMAT_STRING } from '@/constants'

import { TIMEZONE } from '@/libs/dayjs'

export const formatDate = (date, formatString = FORMAT_STRING.date_str) =>
  date ? dayjs.utc(date).tz(TIMEZONE).format(formatString) : ''

export const formatUTCDateToISOString = (date) => (date ? dayjs.utc(date).toISOString() : '')

import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import duration from 'dayjs/plugin/duration'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import tz from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

const locales = {
  ja: () => import('dayjs/locale/ja'),
  en: () => import('dayjs/locale/en'),
}

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

dayjs.tz.setDefault('Asia/Tokyo')

export function loadDayjsLocale(locale) {
  locales[locale]().then(() => {
    dayjs.locale(locale)
  })
}

import dayjs from 'dayjs'

import { FORMAT_STRING } from '@/constants'

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

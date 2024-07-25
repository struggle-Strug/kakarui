import { LexoRank } from 'lexorank'
import get from 'lodash/get'

/**
 *
 * @param {Array} data array of rank data
 * @param {string} sortKey
 * @returns {LexoRank}
 */

export function generateNewRank(data, sortKey = 'ordering') {
  if (Array.isArray(data) && data.length === 0) {
    return LexoRank.middle().toString()
  }

  const latestTask = data[0] || {}
  const parsedRank = LexoRank.parse(latestTask[sortKey] || '0|hzzzzz:')
  return parsedRank.genPrev().toString()
}

/**
 *
 * @param {number} sourceIndex
 * @param {number} destinationIndex
 * @param {Array} data
 * @param {string} sortKey
 * @returns {string} lexoRank
 */

export function getNewRank(data, oldIndex, newIndex, sortKey = 'ordering') {
  try {
    // New Rank
    if (!data.length) {
      return LexoRank.middle().toString()
    }

    // First
    if (newIndex === 0) {
      return LexoRank.parse(data[0][sortKey]).genPrev().toString()
    }

    // Last
    if (newIndex === data.length - 1) {
      return LexoRank.parse(data[data.length - 1][sortKey])
        .genNext()
        .toString()
    }

    // Middle
    const clone = [...data]
    clone.splice(oldIndex, 1)

    const previousRank = LexoRank.parse(clone[newIndex - 1][sortKey])
    const nextRank = LexoRank.parse(clone[newIndex][sortKey])
    return previousRank.between(nextRank).toString()
  } catch (error) {
    return LexoRank.middle().toString()
  }
}

// helper

export const updateItemOrder = (data, itemId, newOrder, sortKey) => {
  return (data || []).map((item) => (item.id === itemId ? { ...item, [sortKey]: newOrder } : item))
}

export const sortByLexoRankAsc = (a = {}, b = {}, sortKey = 'ordering') => {
  const getValue = (item) => get(item, sortKey, '')

  try {
    return getValue(a).localeCompare(getValue(b))
  } catch (error) {
    return -1
  }
}

export const chunkAndSort = (data, itemId, newOrder, sortKey) => {
  const dataUpdated = updateItemOrder(data, itemId, newOrder, sortKey)
  const sortedResults = dataUpdated.sort((a, b) => sortByLexoRankAsc(a, b, sortKey))

  return sortedResults
}

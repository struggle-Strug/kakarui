import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { tryParseJson } from '@/utils/helper'

import { placeHolderData } from '@/services/placeholder-data'

const data = placeHolderData.module.module || []

const moduleApiStub = {
  getModule: sinon.stub().callsFake((sort, search) => {
    let filteredData = [...data]

    if (search) {
      const searchTerm = toLower(search)

      filteredData = filteredData.filter((module) => {
        const lowerModuleName = toLower(module.name)
        const lowerExplanation = toLower(module.description)

        return includes(lowerModuleName, searchTerm) || includes(lowerExplanation, searchTerm)
      })
    }

    if (sort) {
      try {
        const sortObject = tryParseJson(sort)?.[0]

        const sortBy = get(sortObject, 'field')
        const sortOrder = get(sortObject, 'value', 'asc')
        const sortOption = get(sortObject, 'option', 'nulls last')

        filteredData = filteredData.sort((a, b) => {
          const valueA = get(a, sortBy)
          const valueB = get(b, sortBy)

          if (valueA == null && valueB == null) {
            return 0
          }
          if (valueA == null) {
            return sortOption === 'nulls first' ? -1 : 1
          }
          if (valueB == null) {
            return sortOption === 'nulls first' ? 1 : -1
          }

          if (typeof valueA === 'string' && typeof valueB === 'string') {
            const lowerA = toLower(valueA)
            const lowerB = toLower(valueB)
            return sortOrder === 'asc' ? lowerA.localeCompare(lowerB) : lowerB.localeCompare(lowerA)
          }

          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error sort:', error)
      }
    } else {
      // sort default
      filteredData = orderBy(filteredData, ['update_date', 'name'], ['desc', 'asc'])
    }

    return Promise.resolve(filteredData)
  }),

  addModule: sinon.stub().callsFake((newModule) => {
    data.push(newModule)
    return Promise.resolve(newModule)
  }),

  updateModule: sinon.stub().callsFake((moduleID, updatedModule) => {
    const index = data.findIndex((module) => module.id === moduleID)
    if (index !== -1) {
      data[index] = updatedModule
      return Promise.resolve(updatedModule)
    }
    return Promise.reject(new Error('Module not found'))
  }),

  // deleteModule: sinon.stub().callsFake((moduleId) => {
  //   const index = data.findIndex((module) => module.id === moduleId)
  //   if (index !== -1) {
  //     data.splice(index, 1)
  //     return Promise.resolve()
  //   }
  //   return Promise.reject(new Error('User not found'))
  // }),
}

export default moduleApiStub

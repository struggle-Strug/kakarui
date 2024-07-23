import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { API_ERROR_CODE, API_ERROR_MESSAGES } from '@/constants'

import { tryParseJson } from '@/utils/helper'

import { placeHolderData } from '@/services/placeholder-data'

const data = placeHolderData.users.users || []

const userApiStub = {
  getUsers: sinon.stub().callsFake((filter, sort, search) => {
    let filteredData = [...data]

    if (search) {
      const searchTerm = toLower(search)

      filteredData = filteredData.filter((user) => {
        const lowerCompany = toLower(user.company)
        const lowerName = toLower(user.name)
        const lowerEmail = toLower(user.mail)

        return (
          includes(lowerCompany, searchTerm) ||
          includes(lowerName, searchTerm) ||
          includes(lowerEmail, searchTerm)
        )
      })
    }

    if (sort) {
      try {
        const sortObject = tryParseJson(sort)?.[0]
        const sortBy = get(sortObject, 'field')
        const sortOrder = get(sortObject, 'value', 'asc')

        filteredData = orderBy(filteredData, [sortBy], [sortOrder])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error sort:', error)
      }
    } else {
      // sort default
      filteredData = orderBy(filteredData, ['enable', 'company', 'mail'], ['desc', 'asc', 'asc'])
    }

    return Promise.resolve(filteredData)
  }),

  addUser: sinon.stub().callsFake((newUser) => {
    // handle error
    if (Object.values(API_ERROR_CODE).includes(newUser.name)) {
      const errors = {
        status_code: 500,
        error_code: newUser.name,
        message: API_ERROR_MESSAGES.USER[newUser.name],
      }
      return Promise.reject(errors)
    }

    data.push(newUser)
    return Promise.resolve(newUser)
  }),

  updateUser: sinon.stub().callsFake((userId, updatedUser) => {
    // handle error
    if (Object.values(API_ERROR_CODE).includes(updatedUser.name)) {
      const errors = {
        status_code: 500,
        error_code: updatedUser.name,
        message: API_ERROR_MESSAGES.USER[updatedUser.name],
      }
      return Promise.reject(errors)
    }

    const index = data.findIndex((user) => user.id === userId)
    if (index !== -1) {
      data[index] = updatedUser
      return Promise.resolve(updatedUser)
    }

    return Promise.reject(new Error('User not found'))
  }),
}

export default userApiStub

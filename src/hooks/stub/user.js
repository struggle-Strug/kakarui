import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { tryParseJson } from '@/utils/helper'

import data from '@/services/mock-data/user'

const userApiStub = {
  getUsers: sinon.stub().callsFake((filter, sort, search) => {
    let filteredData = [...data]

    if (search) {
      const searchTerm = toLower(search)

      filteredData = filteredData.filter((user) => {
        const lowerName = toLower(user.name)
        const lowerEmail = toLower(user.email)

        return includes(lowerName, searchTerm) || includes(lowerEmail, searchTerm)
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
      filteredData = orderBy(filteredData, ['status', 'company', 'mail'], ['desc', 'asc', 'asc'])
    }

    return Promise.resolve(filteredData)
  }),

  addUser: sinon.stub().callsFake((newUser) => {
    data.push(newUser)
    return Promise.resolve(newUser)
  }),

  updateUser: sinon.stub().callsFake((userId, updatedUser) => {
    const index = data.findIndex((user) => user.id === userId)
    if (index !== -1) {
      data[index] = updatedUser
      return Promise.resolve(updatedUser)
    }
    return Promise.reject(new Error('User not found'))
  }),

  deleteUser: sinon.stub().callsFake((userId) => {
    const index = data.findIndex((user) => user.id === userId)
    if (index !== -1) {
      data.splice(index, 1)
      return Promise.resolve()
    }
    return Promise.reject(new Error('User not found'))
  }),
}

export default userApiStub

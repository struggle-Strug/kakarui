import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { API_ERROR_CODE, API_ERROR_MESSAGES } from '@/constants'

import { tryParseJson } from '@/utils/helper'

import data from '@/services/mock-data/project'

const projectApiStub = {
  getProjects: sinon.stub().callsFake((filter, sort, search, projectId, limit, offset) => {
    let filteredData = [...data]

    if (search) {
      const searchTerm = toLower(search)
      filteredData = filteredData.filter((project) => {
        const lowerFullName = toLower(project.name)
        const lowerDescription = toLower(project.description)
        return includes(lowerFullName, searchTerm) || includes(lowerDescription, searchTerm)
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
      filteredData = orderBy(filteredData, ['update_date', 'name'], ['desc', 'asc'])
    }

    if (limit) {
      filteredData = filteredData.slice(offset || 0, (offset || 0) + limit)
    }

    if (projectId && typeof projectId === 'string') {
      filteredData = filteredData.filter((project) => project.id === projectId)
    }

    return Promise.resolve(filteredData)
  }),

  createProject: sinon.stub().callsFake((newProject) => {
    // handle error
    if (Object.values(API_ERROR_CODE).includes(newProject.name)) {
      const errors = {
        status_code: 500,
        error_code: newProject.name,
        message: API_ERROR_MESSAGES.PROJECT[newProject.name],
      }
      return Promise.reject(errors)
    }

    data.push(newProject)
    return Promise.resolve(newProject)
  }),

  updateProject: sinon.stub().callsFake((projectId, updatedProject) => {
    // handle error
    if (Object.values(API_ERROR_CODE).includes(updatedProject.name)) {
      const errors = {
        status_code: 500,
        error_code: updatedProject.name,
        message: API_ERROR_MESSAGES.PROJECT[updatedProject.name],
      }
      return Promise.reject(errors)
    }

    const index = data.findIndex((project) => project.id === projectId)
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedProject }
      return Promise.resolve(data[index])
    }

    return Promise.reject(new Error('Project not found'))
  }),
}

export default projectApiStub

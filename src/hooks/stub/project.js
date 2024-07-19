import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { tryParseJson } from '@/utils/helper'

import data from '@/services/mock-data/project'

const ERRORS = ['E40301', 'E40401', 'E50013']

const projectApiStub = {
  getDefaultProject: sinon.stub().callsFake(() => {
    try {
      const defaultProject = JSON.parse(window.localStorage.getItem('defaultProject'))
      return Promise.resolve(defaultProject)
    } catch (error) {
      window.localStorage.clear('defaultProject')
      return Promise.resolve({})
    }
  }),
  setDefaultProject: sinon.stub().callsFake((inputValue) => {
    const dataDetail = {
      ...inputValue,
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('defaultProject', JSON.stringify(dataDetail))
    }
    return Promise.resolve(dataDetail)
  }),
  getProjects: sinon.stub().callsFake((filter, sort, search, limit, offset) => {
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

    return Promise.resolve(filteredData)
  }),
  createProject: sinon.stub().callsFake((newProject) => {
    // handle erorr
    if (ERRORS.includes(newProject.name)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        status_code: 500,
        error_code: newProject.name,
        message: 'サーバー側で問題が発生しました。',
      })
    }
    data.push(newProject)
    return Promise.resolve(newProject)
  }),
  updateProject: sinon.stub().callsFake((projectId, updatedProject) => {
    const index = data.findIndex((project) => project.id === projectId)
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedProject }
      return Promise.resolve(data[index])
    }
    return Promise.reject(new Error('Project not found'))
  }),
}

export default projectApiStub

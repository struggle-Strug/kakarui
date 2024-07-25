import dayjs from 'dayjs'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { tryParseJson } from '@/utils/helper/functions'

import projectList from '@/services/mock-data/project'
import { placeHolderData } from '@/services/placeholder-data'

const data = placeHolderData.module_config.module_configs || []
const dataDetail = placeHolderData.module_config_detail || {}

// function makeid(length) {
//   let result = ''
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   const charactersLength = characters.length
//   let counter = 0
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//     counter += 1
//   }
//   return result
// }

const moduleConfigApiStub = {
  getRawData: () => data,

  getModuleConfig: sinon.stub().callsFake((filter, sort, search, projectId) => {
    let filteredData = [...data] // Reset filteredData to the original data on each call

    if (projectId) {
      const currentProject =
        projectList?.find((project) => project.id === projectId) || projectList?.[0]
      filteredData = filteredData.map((d, index) => ({
        ...d,
        project_id: projectId,
        name: `${currentProject?.name} ${data?.[index]?.name || ''}`,
        description: d?.description,
        create_date: dayjs()
          .subtract(index + 4, 'hour')
          .toISOString(),
        update_date: dayjs()
          .subtract(index + 4, 'hour')
          .toISOString(),
      }))
      filteredData = filteredData.filter((module) => module.project_id === projectId)
    }

    if (search) {
      const searchTerm = toLower(search)
      // eslint-disable-next-line no-console
      console.log(searchTerm, 'searchkeyword')
      filteredData = filteredData.filter((module) => {
        const lowerName = toLower(module.name)
        const lowerDescription = toLower(module.description)

        return includes(lowerName, searchTerm) || includes(lowerDescription, searchTerm)
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

  getModuleConfigById: sinon.stub().callsFake(() => {
    return Promise.resolve(dataDetail)
  }),

  createModuleConfig: sinon.stub().callsFake((newModule) => {
    data.push(newModule)
    return Promise.resolve(newModule)
  }),

  updateModuleConfig: sinon.stub().callsFake((moduleId, updatedModule) => {
    const index = data.findIndex((module) => module.id === moduleId)
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedModule }
      return Promise.resolve(data[index])
    }
    return Promise.reject(new Error('Module not found'))
  }),

  deleteModuleConfig: sinon.stub().callsFake((moduleId) => {
    const index = data.findIndex((module) => module.id === moduleId)
    if (index !== -1) {
      data.splice(index, 1)
      return Promise.resolve()
    }
    return Promise.reject(new Error('Module not found'))
  }),
}

export default moduleConfigApiStub

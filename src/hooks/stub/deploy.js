import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { tryParseJson } from '@/utils/helper/functions'

import { mockData } from '@/services/mock-data'

const data = mockData.deploy_list.deploys || []

const deployApiStub = {
  getRawData: () => data,

  getModuleSet: sinon.stub().callsFake(({ sort, search } = {}) => {
    let result = [...data]

    if (search) {
      const lowerSearchTerm = toLower(search)
      result = result.filter((item) => includes(toLower(item.module_config_name), lowerSearchTerm))
    }

    if (sort) {
      try {
        const sortObject = tryParseJson(sort)?.[0]

        const sortBy = get(sortObject, 'field')
        const sortOrder = get(sortObject, 'value', 'asc')

        return orderBy(data, [sortBy], [sortOrder])
      } catch (error) {
        return data
      }
    } else {
      // sort default
      result = orderBy(result, ['create_date', 'module_config_name'], ['desc', 'asc'])
    }

    return Promise.resolve(result)
  }),

  getDeployDetail: sinon.stub().callsFake((deployId) => {
    return Promise.resolve(data.find((deploy) => deploy?.id === deployId) || null)
  }),
}

export default deployApiStub

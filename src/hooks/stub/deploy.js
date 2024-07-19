import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { tryParseJson } from '@/utils/helper'

import data from '@/services/mock-data/deployment'
import data2 from '@/services/mock-data/deployment2'
import { placeHolderData } from '@/services/placeholder-data'

const dataDetail = placeHolderData.deployment_detail || {}
const ERRORS = ['E40301', 'E40401', 'E50013']

const deployApiStub = {
  getDeploy: sinon.stub().callsFake((sort, search, time) => {
    let filteredData = time % 2 === 0 ? [...data] : [...data2]
    if (search) {
      const searchTerm = toLower(search)

      filteredData = filteredData.filter((deploy) => {
        const lowerFullName = toLower(deploy.module_config_name)
        return includes(lowerFullName, searchTerm)
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
      filteredData = orderBy(filteredData, ['create_date', 'module_config_name'], ['desc', 'asc'])
    }

    return Promise.resolve(filteredData)
  }),

  getDeployById: sinon.stub().callsFake(() => {
    return Promise.resolve(dataDetail)
  }),

  startDeploy: sinon.stub().callsFake((newDeploy) => {
    // handle erorr
    if (ERRORS.includes(newDeploy.name)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        status_code: 500,
        error_code: newDeploy.name,
        message: 'サーバー側で問題が発生しました。',
      })
    }
    data.push(newDeploy)
    return Promise.resolve(newDeploy)
  }),
}

export default deployApiStub

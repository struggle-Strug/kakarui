import dayjs from 'dayjs'
import { clone } from 'lodash'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import toLower from 'lodash/toLower'
import sinon from 'sinon'

import { DEPLOYMENT_TYPE, DEPLOY_STATUS } from '@/constants'

import { tryParseJson } from '@/utils/helper'

import data from '@/services/mock-data/deployment'
import data2 from '@/services/mock-data/deployment2'
import projectList from '@/services/mock-data/project'
import { placeHolderData } from '@/services/placeholder-data'

const dataDetail = placeHolderData.deployment_detail || {}

function makeid(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

const deployApiStub = {
  getDeploy: sinon
    .stub()
    .callsFake((sort, search, projectId, limit, offset, time, isInit = false) => {
      let filteredData = time % 2 === 0 ? [...data] : [...data2]
      const currentProject =
        projectList?.find((project) => project.id === projectId) || projectList?.[0]
      const renderStatus = (indexValue) => {
        switch (indexValue) {
          case 0:
            return DEPLOY_STATUS.IN_PROGRESS
          case 1:
            return DEPLOY_STATUS.PENDING
          default:
            return DEPLOY_STATUS.COMPLETE
        }
      }
      if (isInit && projectId) {
        const fakeData = clone(time % 2 === 0 ? [...data] : [...data2]).map((d, index) => ({
          ...d,
          project_id: projectId,
          module_config_name: `${currentProject?.name} ${makeid(index % 5)}`,
          create_date: dayjs()
            .subtract(index + 4, 'hour')
            .toISOString(),
          update_date: dayjs()
            .subtract(index + 4, 'hour')
            .toISOString(),
          status: renderStatus(index % 7),
          type: Object.values(DEPLOYMENT_TYPE)[index % 2 === 0 ? 0 : 1],
          execute_result_url:
            // eslint-disable-next-line no-nested-ternary
            renderStatus(index % 7) === DEPLOY_STATUS.COMPLETE
              ? index % 2 === 0
                ? dataDetail?.execute_result_url
                : ''
              : '',
        }))
        if (projectId) {
          filteredData = fakeData.filter((deploy) => {
            return deploy?.project_id === projectId
          })
        }
      }

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
      if (limit) {
        filteredData = filteredData.slice(offset || 0, (offset || 0) + limit)
      }

      return Promise.resolve(filteredData)
    }),

  getDeployById: sinon.stub().callsFake(() => {
    return Promise.resolve(dataDetail)
  }),

  startDeploy: sinon.stub().callsFake((newDeploy) => {
    data.push(newDeploy)
    data2.push(newDeploy)
    return Promise.resolve(newDeploy)
  }),
  updateDeploy: sinon.stub().callsFake((newDeploy, dataList) => {
    const index = dataList.findIndex((item) => item.id === newDeploy?.id)
    if (dataList && index !== -1) {
      dataList[index] = { ...data[index], ...newDeploy }
      return Promise.resolve(data[index])
    }

    return Promise.reject(new Error('Project not found'))
  }),
}

export default deployApiStub

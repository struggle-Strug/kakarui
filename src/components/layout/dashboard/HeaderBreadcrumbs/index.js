/* eslint-disable camelcase */
import { useMemo } from 'react'

import { useOrganizationQuery, useProjectActive } from '@/hooks/query'

import { Breadcrumbs } from '@/components/common'

import { truncateText } from '@/utils/helper/strings'

import ProjectMenu from './ProjectMenu'
import RobotMenu from './RobotMenu'
import SipMenu from './SipMenu'

const HeaderBreadcrumbs = () => {
  const { organizationName } = useOrganizationQuery()
  const { projectActive } = useProjectActive()

  const breadcrumbs = useMemo(
    () => [
      // { key: 'robocon', title: 'ロボコン2024' },
      // { key: 'team_name', title: 'Team Eagle' },
      {
        key: 'prototype',
        title: truncateText(projectActive?.name, 20) || '',
      },
    ],
    [projectActive?.name]
  )

  const renderOrganizationName = (
    <>
      <SipMenu />
      <div>{organizationName}</div>
    </>
  )

  const renderBreadcrumbs = (
    <>
      <ProjectMenu breadcrumbs={breadcrumbs} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </>
  )

  const renderRobotName = <RobotMenu />

  return (
    <div className="flex h-11 items-center space-x-[54px] pl-[44px] text-sm font-semibold text-dark-gray-3">
      <div className="flex h-full flex-col justify-between">{renderOrganizationName}</div>
      <div className="flex h-full flex-col justify-between">{renderBreadcrumbs}</div>
      <div className="flex h-full flex-col justify-between">{renderRobotName}</div>
    </div>
  )
}

export default HeaderBreadcrumbs

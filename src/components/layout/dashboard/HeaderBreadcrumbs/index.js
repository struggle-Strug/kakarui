/* eslint-disable camelcase */
import { useMemo } from 'react'

import { useGetMe, useOrganizationQuery, useProjectActive } from '@/hooks/query'

import { Breadcrumbs } from '@/components/common'

import OrgMenu from './OrgMenu'
import ProjectMenu from './ProjectMenu'
import RobotMenu from './RobotMenu'

const HeaderBreadcrumbs = () => {
  const { organizationDetail, organizationName, organizationId, organizations } = useOrganizationQuery()
  const { projectActive } = useProjectActive()
  const { isMember } = useGetMe();
  const filteredOrganizations = organizations.filter(org => org.organization_id == organizationId);
  const breadcrumbs = useMemo(
    () => [
      // { key: 'robocon', title: 'ロボコン2024' },
      // { key: 'team_name', title: 'Team Eagle' },
      {
        key: 'prototype',
        title: (
          <div className="max-w-60 truncate" title={projectActive?.name || ''}>
            {projectActive?.name || ''}
          </div>
        ),
      },
    ],
    [projectActive?.name]
  )

  const renderOrganizationName = (
    <>
      <OrgMenu organizationDetail={organizationDetail} isMember={isMember} />
      <div>{filteredOrganizations[0]?.organization_name}</div>
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

/* eslint-disable camelcase */
import Image from 'next/image'
import { useMemo } from 'react'

import { Assets } from '@/constants'
import { useOrganizationQuery, useProjectActive } from '@/hooks/query'

import { Breadcrumbs } from '@/components/common'

import ProjectMenu from './ProjectMenu'
import SipMenu from './SipMenu'

const HeaderBreadcrumbs = () => {
  const { organizationName } = useOrganizationQuery()
  const { projectActive } = useProjectActive()

  const breadcrumbs = useMemo(
    () => [
      // { key: 'robocon', title: 'ロボコン2024' },
      // { key: 'team_name', title: 'Team Eagle' },
      { key: 'prototype', title: projectActive?.name || '' },
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

  const renderProjectName = (
    <>
      <div className="text-sm">ターゲット</div>
      <div className="flex items-center">
        <Image src={Assets.MENU.project} alt="gen3p" width={24} height={22} />
        <span className="ml-3 text-sm">Nyokkey Gen3B</span>
      </div>
    </>
  )

  return (
    <div className="flex h-11 items-center space-x-[54px] pl-[44px] text-sm font-semibold text-dark-gray-3">
      <div className="flex h-full flex-col justify-between">{renderOrganizationName}</div>
      <div className="flex h-full flex-col justify-between">{renderBreadcrumbs}</div>
      <div className="flex h-full flex-col justify-between">{renderProjectName}</div>
    </div>
  )
}

export default HeaderBreadcrumbs

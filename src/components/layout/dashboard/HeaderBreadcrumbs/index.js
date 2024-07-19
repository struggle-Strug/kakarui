/* eslint-disable camelcase */
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { Assets } from '@/constants'

import { Breadcrumbs } from '@/components/common'

import ProjectMenu from './ProjectMenu'
import SipMenu from './SipMenu'

const generateBreadcrumbs = (_, params) => {
  // const { project, robocon_year, team_name, prototype, device } = router.query

  const breadcrumbs = [{ key: 'prototype', title: params?.project?.name || '' }]

  // if (project) {
  //   breadcrumbs.push({ key: 'project', title: project })
  // }

  // if (robocon_year) {
  //   breadcrumbs.push({ key: 'robocon', title: robocon_year })
  // }

  // if (team_name) {
  //   breadcrumbs.push({ key: 'team_name', title: team_name })
  // }

  // if (prototype) {
  //   breadcrumbs.push({ key: 'prototype', title: prototype })
  // }

  // if (device) {
  //   breadcrumbs.push({ key: 'device', title: device })
  // }

  // // Add default values if no queries are present
  // if (breadcrumbs.length === 0) {
  //   breadcrumbs.push(
  //     { key: 'robocon', title: 'ロボコン2024' },
  //     { key: 'team_name', title: 'Team Eagle' },
  //     { key: 'prototype', title: 'プロト1.5' }
  //   )
  // }

  return breadcrumbs
}

const HeaderBreadcrumbs = ({ project, refreshProject }) => {
  const router = useRouter()
  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(router, { project }),
    [router.query, project]
  )

  const renderOrganizationName = (
    <>
      <SipMenu />
      <div>SIP</div>
    </>
  )

  const renderBreadcrumbs = (
    <>
      <ProjectMenu breadcrumbs={breadcrumbs} project={project} refreshProject={refreshProject} />
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

import { Dropdown } from 'antd'

import Image from 'next/image'
import { useRouter } from 'next/router'

import { Assets, Routes } from '@/constants'
import { useFlag } from '@/hooks/share'

import { Breadcrumbs } from '@/components/common'
import { ProjectAddEditModal } from '@/components/project'

import ProjectSubMenu from './ProjectSubMenu'

const ProjectMenu = ({ project, refreshProject = () => {} }) => {
  const router = useRouter()
  const [open, onOpen, onClose] = useFlag()

  const breadcrumbs = [
    // { key: 'robocon', title: 'ロボコン2024' },
    // { key: 'team_name', title: 'Team Eagle' },
    { key: 'prototype', title: project?.name },
  ]
  const items = [
    {
      label: (
        <div className="border-bottom-gray mx-[12px] flex w-[498px] items-center px-3 py-6 text-lg">
          <div>
            <Image src={Assets.MENU.project} alt="gen3p" width={48} height={44} />
          </div>
          <div className="pl-3 font-semibold text-dark-gray-3">
            <div className="text-lg ">プロジェクトサブメニュー</div>
            <Breadcrumbs breadcrumbs={breadcrumbs} className="text-lg" />
          </div>
        </div>
      ),
      onClick: () => null,
      key: '0',
    },
    {
      label: (
        <div className="border-bottom-gray mx-[12px] w-[498px] px-3 py-6 text-lg font-light text-primary">
          <ProjectAddEditModal onSuccess={() => router.push(Routes.PROJECT)}>
            <div> 新規プロジェクト作成</div>
          </ProjectAddEditModal>
        </div>
      ),
      onClick: () => null,
      key: '1',
    },
    {
      label: (
        <div className="border-bottom-gray mx-[12px] w-[498px] px-3 py-6 text-lg font-light text-primary">
          プロジェクト管理
        </div>
      ),
      onClick: () => router.push(Routes.PROJECT),
      key: '2',
    },
    {
      label: (
        <ProjectSubMenu
          onSetDefaultProject={(res) => {
            refreshProject(res)
            onClose()
          }}
        />
      ),
      onClick: ({ domEvent: event }) => {
        event.preventDefault()
      },
      disabled: true,
      className: '!pointer-events-auto !cursor-pointer !rounded-l-[24px] !rounded-r-[24px]',
      key: '3',
    },
  ]

  return (
    <div>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        overlayClassName="pt-9 header-dropdown"
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            onOpen()
          } else {
            onClose()
          }
        }}
      >
        <div className="w-max cursor-pointer text-sm hover:opacity-75">プロジェクト</div>
      </Dropdown>
    </div>
  )
}

export default ProjectMenu

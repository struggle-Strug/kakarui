import { Dropdown } from 'antd'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Assets, Routes } from '@/constants'
import { useProjectActive, useProjectQuery } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { Breadcrumbs } from '@/components/common'
import { ProjectAddEditModal } from '@/components/project'

import ProjectSubMenu from './ProjectSubMenu'

const ProjectMenu = ({ breadcrumbs }) => {
  const router = useRouter()

  const [open, onOpen, onClose] = useFlag()

  const { data, isLoading } = useProjectQuery({
    sort: JSON.stringify([{ field: 'create_date', value: 'asc' }]),
  })

  const { projectActive, setProjectActive } = useProjectActive()

  useEffect(() => {
    if (!projectActive?.name && data?.[0]?.name) {
      setProjectActive(data?.[0])
    }
  }, [data])

  const items = [
    {
      label: (
        <div className="border-bottom-gray mx-3 flex w-[420px] items-center px-3 py-4">
          <div>
            <Image src={Assets.MENU.project} alt="gen3p" width={48} height={44} />
          </div>
          <div className="pl-3 font-semibold text-dark-gray-3">
            <div>プロジェクトサブメニュー</div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      ),
      onClick: () => null,
      key: '0',
    },
    {
      label: (
        <div className="border-bottom-gray mx-3 w-[420px] px-3 py-4 font-light text-primary">
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
        <div className="border-bottom-gray mx-3 w-[420px] px-3 py-4 font-light text-primary">
          プロジェクト管理
        </div>
      ),
      onClick: () => router.push(Routes.PROJECT),
      key: '2',
    },
    {
      label: (
        <ProjectSubMenu
          data={data}
          loading={isLoading}
          setProjectActive={setProjectActive}
          onClose={onClose}
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
        overlayClassName="pt-7 header-dropdown"
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
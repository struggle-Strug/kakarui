import { Dropdown } from 'antd'
import noop from 'lodash/noop'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Assets, Routes } from '@/constants'
import { useGetMe, useProjectActive, useProjectQuery, useUserActive } from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { Breadcrumbs } from '@/components/common'
import { ProjectAddEditModal } from '@/components/project'

import { cn } from '@/utils/helper/functions'

import ProjectSubMenu from './ProjectSubMenu'

const ProjectMenu = ({ breadcrumbs }) => {
  const router = useRouter()

  const [open, onOpen, onClose] = useFlag()

  const { filteredData, isLoading } = useProjectQuery({
    sort: JSON.stringify([{ field: 'create_date', value: 'desc' }]),
  })

  const { projectActive, setProjectActive } = useProjectActive()
  const { data: me = {}, isAcceptedAddEditProject } = useGetMe()
  const { userActiveId } = useUserActive()

  useEffect(() => {
    if (filteredData?.[0]?.name && (me?.id !== userActiveId || !projectActive?.name)) {
      setProjectActive(filteredData?.[0])
    }
  }, [filteredData, me?.id, userActiveId])

  const items = [
    {
      label: (
        <div className="border-bottom-gray mx-3 flex w-[420px] cursor-default items-center px-3 py-4">
          <div>
            <Image src={Assets.MENU.project} alt="gen3p" width={48} height={44} />
          </div>
          <div className="pl-3 font-semibold text-dark-gray-3">
            <div>プロジェクトサブメニュー</div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      ),
      onClick: noop,
      key: '0',
    },
    {
      label: (
        <ProjectAddEditModal onSuccess={() => router.push(Routes.PROJECT)}>
          <div
            className={cn('border-bottom-gray mx-3 w-[420px] px-3 py-4 font-light text-primary', {
              'text-dark-grey-2': !isAcceptedAddEditProject,
            })}
          >
            新規プロジェクト作成
          </div>
        </ProjectAddEditModal>
      ),
      disabled: !isAcceptedAddEditProject,
      onClick: noop,
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
      label: <ProjectSubMenu data={filteredData} loading={isLoading} onClose={onClose} />,
      onClick: ({ domEvent: event }) => {
        event.preventDefault()
      },
      disabled: true,
      className: '!pointer-events-auto !cursor-pointer !rounded-l-[24px] !rounded-r-[24px]',
      key: '3',
    },
  ]

  const onOpenChange = (enable) => (enable ? onOpen() : onClose())

  return (
    <div>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        overlayClassName="pt-7 header-dropdown"
        onOpenChange={onOpenChange}
        open={open}
      >
        <div className="w-max cursor-pointer text-sm hover:opacity-75">プロジェクト</div>
      </Dropdown>
    </div>
  )
}

export default ProjectMenu

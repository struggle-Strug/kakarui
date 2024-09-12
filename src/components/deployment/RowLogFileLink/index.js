import { Space } from 'antd'
import noop from 'lodash/noop'

import { Routes } from '@/constants'

import { LogFileIcon } from '@/components/icons'
import { RowTextLink } from '@/components/table'
import { ButtonIcon } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const RowLogFileLink = ({ item }) => {
  const { id: deployId, project_id: projectId, deploy_log_file_name: fileName } = item || {}

  const disabled = Boolean(!deployId || !projectId || !fileName)

  return (
    <RowTextLink
      pathname={Routes.DEPLOY_LOG_SHOW_DETAIL}
      query={{ deploy_id: deployId, project_id: projectId, file_name: fileName }}
      disabled={disabled}
    >
      <Space className={cn('flex-center', { 'opacity-75': disabled })}>
        <ButtonIcon icon={<LogFileIcon />} disabled={disabled} onClick={noop} />
      </Space>
    </RowTextLink>
  )
}

export default RowLogFileLink

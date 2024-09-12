import { useRouter } from 'next/router'

import LogShowDetailContainer from '@/containers/Log/LogDetail'

const LogShowDetailPage = () => {
  const router = useRouter()
  const { project_id: projectId, deploy_id: deployId, file_name: fileName } = router.query || {}

  return <LogShowDetailContainer projectId={projectId} deployId={deployId} fileName={fileName} />
}

export default LogShowDetailPage

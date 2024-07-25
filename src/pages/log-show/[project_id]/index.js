import { useRouter } from 'next/router'

import LogShowDetailContainer from '@/containers/Log/LogDetail'

const LogShowDetailPage = () => {
  const router = useRouter()
  const projectId = router.query.project_id

  return <LogShowDetailContainer projectId={projectId} />
}

export default LogShowDetailPage

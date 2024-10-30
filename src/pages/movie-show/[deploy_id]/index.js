import { useRouter } from 'next/router'

import MovieShowDetailContainer from '@/containers/Movie/MovieDetail'

const MovieShowDetailPage = () => {
  const router = useRouter()
  const { project_id: projectId, deploy_id: deployId, file_name: fileName } = router.query || {}

  return <MovieShowDetailContainer projectId={projectId} deployId={deployId} fileName={fileName} />
}

export default MovieShowDetailPage

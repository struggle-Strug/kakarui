import { useRouter } from 'next/router'

import MovieShowDetailContainer from '@/containers/Movie/MovieDetail'

const MovieShowDetailPage = () => {
  const router = useRouter()
  const projectId = router.query.project_id

  return <MovieShowDetailContainer projectId={projectId} />
}

export default MovieShowDetailPage

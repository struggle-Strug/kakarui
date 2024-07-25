import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import { useDeployQuery } from '@/hooks/query'

import { Container } from '@/components/ui'

import { Container } from '@/components/ui'

const MovieShowDetailContainer = ({ projectId }) => {
  const [detail, setDetail] = useState()

  const { getDeployDetail } = useDeployQuery()

  useEffect(() => {
    setDetail(getDeployDetail(projectId))
  }, [projectId])

  return (
    <Container title="ログ表示(動画)">
      <div className="player-wrapper">
        <ReactPlayer
          url={detail?.execute_result_url}
          className="react-player"
          height="100%"
          width="100%"
          controls
          muted
          volume={0}
        />
      </div>
    </Container>
  )
}

export default MovieShowDetailContainer

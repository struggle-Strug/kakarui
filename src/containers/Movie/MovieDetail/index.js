import Head from 'next/head'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import deployApiStub from '@/hooks/stub/deploy'

import { Container } from '@/components/ui'

const MovieShowDetailContainer = ({ projectId }) => {
  const [detail, setDetail] = useState()

  useEffect(() => {
    deployApiStub.getDeployById(projectId).then(setDetail)
  }, [projectId])

  return (
    <Container title="ログ表示(動画)">
      <Head>
        <title>ログ表示(動画)</title>
      </Head>
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

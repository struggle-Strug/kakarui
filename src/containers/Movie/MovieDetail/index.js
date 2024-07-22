import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import deployApiStub from '@/hooks/stub/deploy'

const MovieShowDetailContainer = ({ projectId }) => {
  const [detail, setDetail] = useState()

  useEffect(() => {
    deployApiStub.getDeployById(projectId).then(setDetail)
  }, [projectId])

  return (
    <div>
      <div className="mb-9 text-lg font-semibold text-dark-gray-3">ログ表示(動画)</div>
      <div className="player-wrapper">
        <ReactPlayer
          url={detail?.execute_result_url}
          className="react-player"
          controls
          width="100%"
          height="100%"
        />
      </div>
    </div>
  )
}

export default MovieShowDetailContainer

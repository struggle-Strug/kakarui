import { Empty, Spin } from 'antd'

import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import { useDeployByProjectQuery } from '@/hooks/query'

import { Container } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const MovieShowDetailContainer = ({ projectId, deployId }) => {
  const [detail, setDetail] = useState()

  const { data, isLoading, getDeployDetail } = useDeployByProjectQuery({ projectId })

  useEffect(() => {
    setDetail(getDeployDetail(deployId))
  }, [deployId, projectId, data])

  return (
    <Container title="ログ表示(動画)">
      <Spin className="w-full" spinning={isLoading}>
        {detail?.execute_result_url && deployId ? (
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
        ) : (
          <div
            className={cn('flex h-full w-full items-center justify-center', {
              hidden: isLoading,
            })}
          >
            <Empty className="h-full w-full" />
          </div>
        )}
      </Spin>
    </Container>
  )
}

export default MovieShowDetailContainer

import { Empty, Spin } from 'antd'
import dayjs from 'dayjs'

import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import { EXPIRED_URL, FORMAT_STRING } from '@/constants'
import { useDeployByProjectQuery, useVideoQuery } from '@/hooks/query'

import { Container } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

const MovieShowDetailContainer = ({ projectId, deployId }) => {
  const [detail, setDetail] = useState()

  const { data, isLoading, getDeployDetail } = useDeployByProjectQuery({ projectId })

  if (detail?.id) {
    // eslint-disable-next-line no-console
    console.log('deploy detail', detail)
  }

  const { data: videoData } = useVideoQuery({
    projectId,
    deployId,
    body: {
      file_name: detail?.sim_video_file_name,
      end_date: dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT).format(FORMAT_STRING.datetime_full),
    },
  })

  const videoURL = videoData?.url

  useEffect(() => {
    setDetail(getDeployDetail(deployId))
  }, [deployId, projectId, data])

  return (
    <Container title="ログ表示(動画)">
      <Spin className="w-full" spinning={isLoading}>
        {videoURL && deployId ? (
          <div className="player-wrapper">
            <ReactPlayer
              url={videoURL}
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

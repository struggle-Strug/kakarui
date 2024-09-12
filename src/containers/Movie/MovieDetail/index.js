import { Empty, Spin } from 'antd'
import dayjs from 'dayjs'

import ReactPlayer from 'react-player'

import { EXPIRED_URL } from '@/constants'
import { useVideoQuery } from '@/hooks/query'

import { Container } from '@/components/ui'

import { formatUTCDateToISOString } from '@/utils/helper/dayjs'
import { cn } from '@/utils/helper/functions'

const MovieShowDetailContainer = ({ projectId, deployId, fileName }) => {
  const endDateSet = dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT)

  const dataRequest = {
    file_name: fileName,
    end_date: formatUTCDateToISOString(endDateSet),
  }

  const { data, isLoading } = useVideoQuery({ projectId, deployId, body: dataRequest })

  const videoURL = data?.url || ''

  const render = () => {
    if (!videoURL || !deployId) {
      return (
        <div
          className={cn('flex h-full w-full items-center justify-center py-20', {
            hidden: isLoading,
          })}
        >
          <Empty className="h-full w-full" />
        </div>
      )
    }

    return (
      <div className="player-wrapper">
        <ReactPlayer
          url={videoURL}
          className="react-player"
          // config={reactLayerConfig}
          height="100%"
          width="100%"
          controls
          muted
        />
      </div>
    )
  }

  return (
    <Container title="ログ表示(動画)">
      <Spin className="w-full" spinning={isLoading}>
        {render()}
      </Spin>
    </Container>
  )
}

export default MovieShowDetailContainer

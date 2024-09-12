import { Empty, Spin } from 'antd'
import dayjs from 'dayjs'

import ReactPlayer from 'react-player'

import { EXPIRED_URL, FORMAT_STRING } from '@/constants'
import { useVideoQuery } from '@/hooks/query'

import { Container } from '@/components/ui'

import { cn } from '@/utils/helper/functions'

// const reactLayerConfig = {
//   file: {
//     attributes: {
//       controlsList: 'nodownload',
//       disablePictureInPicture: true,
//     },
//   },
// }

const MovieShowDetailContainer = ({ projectId, deployId, fileName }) => {
  const dataRequest = {
    file_name: fileName,
    end_date: dayjs().add(EXPIRED_URL.TIME, EXPIRED_URL.UNIT).format(FORMAT_STRING.datetime_full),
  }

  const { data: videoData, isLoading } = useVideoQuery({ projectId, deployId, body: dataRequest })

  const videoURL = videoData?.url

  return (
    <Container title="ログ表示(動画)">
      <Spin className="w-full" spinning={isLoading}>
        {videoURL && deployId ? (
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

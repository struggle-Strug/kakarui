import React from 'react'

import { DEPLOY_STATUS } from '@/constants'

import { ThumbnailLink } from '@/components/common'

import { base64ToImageUrl } from '@/utils/helper/image'

const DeployThumbnailLink = ({ item, index }) => {
  const { sim_video_thumbnail: thumbnail, sim_video_file_name: fileName } = item || {}

  const isCompletedStatus = item?.status === DEPLOY_STATUS.COMPLETE

  if (!isCompletedStatus || !thumbnail) return <div className="h-[84px]" />

  return (
    <ThumbnailLink
      deployId={item?.id}
      thumbnailUrl={base64ToImageUrl(thumbnail)}
      projectId={item?.project_id}
      fileName={fileName}
      index={index}
    />
  )
}

export default DeployThumbnailLink

import { Routes } from '@/constants'

import { Link } from '@/components/ui'

// DRAFT
const getThumbnail = (index) => {
  const random = (index % 9) + 1
  return `images/thumbnail/thumbnail-${random || 0}.png`
}

const ThumbnailLink = ({ thumbnailUrl, deployId, projectId, index }) => (
  <Link
    href={{
      pathname: Routes.DEPLOY_MOVIE_SHOW_DETAIL,
      query: { deploy_id: deployId, project_id: projectId },
    }}
    className="flex min-w-[154px] justify-center transition-opacity hover:opacity-75"
    disabled={!deployId || !projectId}
  >
    <img
      src={thumbnailUrl || getThumbnail(index)}
      className="h-[84px] w-[149px] rounded object-contain"
      alt="thumbnail"
    />
  </Link>
)

export default ThumbnailLink

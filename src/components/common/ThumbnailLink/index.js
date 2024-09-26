import { Routes } from '@/constants'

import { Link } from '@/components/ui'

const ThumbnailLink = ({ thumbnailUrl, deployId, projectId, fileName }) => (
  <Link
    href={{
      pathname: Routes.DEPLOY_MOVIE_SHOW_DETAIL,
      query: { deploy_id: deployId, project_id: projectId, file_name: fileName },
    }}
    className="flex min-w-[154px] justify-center transition-opacity hover:opacity-75"
    disabled={!deployId || !projectId || !fileName}
  >
    {thumbnailUrl ? (
      <img
        src={thumbnailUrl}
        className="h-[84px] w-[149px] rounded object-contain"
        alt="thumbnail"
      />
    ) : null}
  </Link>
)

export default ThumbnailLink

import random from 'lodash/random'

import { Routes } from '@/constants'

import { Link } from '@/components/ui'

// DRAFT
const getThumbnail = () => {
  return `images/thumbnail/thumbnail-${random(1, 9)}.png`
}

const ThumbnailLink = ({ itemId }) => (
  <Link
    href={{ pathname: Routes.DEPLOY_MOVIE_SHOW_DETAIL, query: { deploy_id: itemId } }}
    className="flex min-w-[154px] justify-center transition-opacity hover:opacity-75"
    disabled={!itemId}
  >
    <img src={getThumbnail()} className="h-[84px] w-[149px] rounded object-cover" alt="thumbnail" />
  </Link>
)

export default ThumbnailLink

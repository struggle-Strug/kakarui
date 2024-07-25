import { Breadcrumb as AntdBreadcrumb } from 'antd'

import { useRouter } from 'next/router'

const Breadcrumbs = ({ breadcrumbs }) => {
  const router = useRouter()
  if (!breadcrumbs?.length) {
    return null
  }

  const handleClickBreadcrumb = (href) => {
    if (href) {
      router.push(href, null, { shallow: true })
    }
  }

  const items = (breadcrumbs || []).map((b) => ({
    title: b.title,
    onClick: () => handleClickBreadcrumb(b?.href),
  }))

  return <AntdBreadcrumb items={items} className="text-sm text-dark-gray-3" separator=">" />
}

export default Breadcrumbs

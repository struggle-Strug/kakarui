import { Breadcrumb as AntdBreadcrumb } from 'antd'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useLocalStorage } from '@/hooks/share'
import projectApiStub from '@/hooks/stub/project'

const Breadcrumbs = ({ breadcrumbs }) => {
  const router = useRouter()
  const [project, setProject] = useLocalStorage('defaultProject')
  const refreshProject = () => {
    projectApiStub.getDefaultProject().then(setProject)
  }

  useEffect(() => {
    refreshProject()
  }, [])

  if (!breadcrumbs?.length) {
    return null
  }

  const handleClickBreadcrumb = (href) => {
    if (href) {
      router.push(href, null, { shallow: true })
    }
  }

  const items = (breadcrumbs || []).map((b) => ({
    title: b.title || project?.name || 'プロト1.5',
    onClick: () => handleClickBreadcrumb(b?.href),
  }))

  return <AntdBreadcrumb items={items} className="text-sm text-dark-gray-3" separator=">" />
}

export default Breadcrumbs

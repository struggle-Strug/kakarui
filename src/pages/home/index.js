/* eslint-disable no-console */
import { useAuth, useGetMe, useProjectList } from '@/hooks/query'

import HomeContainer from '@/containers/Home'

const HomePage = () => {
  const auth = useAuth()
  const { data: me = {} } = useGetMe()
  const { data: projects = [] } = useProjectList()

  console.log({ auth })
  console.log({ me })
  console.log({ projects })

  return <HomeContainer />
}

export default HomePage

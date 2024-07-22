/* eslint-disable no-console */
import { useAuth } from '@/hooks/query'

import HomeContainer from '@/containers/Home'

const HomePage = () => {
  const auth = useAuth()
  console.log(auth)
  return <HomeContainer />
}

export default HomePage

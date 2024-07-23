import { AuthorizationCheck } from '@/components/common'

import DeployContainer from '@/containers/Deploy'

const DeployManagePage = () => {
  return (
    <AuthorizationCheck>
      <DeployContainer />
    </AuthorizationCheck>
  )
}

export default DeployManagePage

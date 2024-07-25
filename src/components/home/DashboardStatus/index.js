import { useMyDeploy } from '@/hooks/query'

import { ReloadIcon } from '@/components/icons'
import { HeaderTitle } from '@/components/layout/dashboard'
import { Button } from '@/components/ui'

import MyDeploymentTable from './MyDeploymentTable'

const DashboardStatus = () => {
  const { data: myDeploys, isLoading, refetch } = useMyDeploy({ limit: 10 })

  return (
    <div
      className="flex w-full flex-col"
      style={{ '-ms-word-break': 'break-keep', lineBreak: 'auto', overflowWrap: 'anywhere' }}
    >
      <div className="flex flex-row justify-between">
        <HeaderTitle title="ダッシュボード" />
        <Button
          label="リロード"
          icon={<ReloadIcon size={32} />}
          onClick={() => refetch?.()}
          type="outline"
        />
      </div>

      <MyDeploymentTable data={myDeploys} total={myDeploys.length} loading={isLoading} />
    </div>
  )
}

export default DashboardStatus

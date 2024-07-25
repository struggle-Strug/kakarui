import { INTERVAL_5M } from '@/constants'
import { useDeployQuery } from '@/hooks/query'

import { ReloadIcon } from '@/components/icons'
import { HeaderTitle } from '@/components/layout/dashboard'
import { Button } from '@/components/ui'

import MyDeploymentTable from './MyDeploymentTable'

const DashboardStatus = () => {
  const { data, isLoading, isFetching, refetch } = useDeployQuery({
    options: {
      refetchInterval: INTERVAL_5M,
    },
  })

  const slicedData = data.slice(0, 10)

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
          onClick={() => refetch()}
          type="outline"
        />
      </div>

      <MyDeploymentTable
        data={slicedData}
        total={slicedData.length}
        loading={isLoading || isFetching}
      />
    </div>
  )
}

export default DashboardStatus

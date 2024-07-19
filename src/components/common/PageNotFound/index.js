import { Result, Space } from 'antd'

import { useRouter } from 'next/router'

import { Button } from '@/components/ui'

const PageNotFound = () => {
  const router = useRouter()

  return (
    <Result
      status="404"
      title="404"
      subTitle="アクセスしたページは存在しません。"
      extra={
        <Space className="flex-center">
          <Button type="primary" onClick={router.back}>
            メインページに戻る
          </Button>
        </Space>
      }
    />
  )
}

export default PageNotFound

import { Button, Result } from 'antd'

import { useRouter } from 'next/router'

const NotFoundPage = () => {
  const router = useRouter()

  return (
    <Result
      status="404"
      title="404"
      subTitle="アクセスしたページは存在しません。"
      extra={<Button onClick={router.back}>メインページに戻る</Button>}
    />
  )
}

export default NotFoundPage

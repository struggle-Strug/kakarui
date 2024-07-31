import { Result as AntdResult, Space } from 'antd'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'

import { Button } from '@/components/ui'

const Result = ({ title, subTitle, extra, ...props }) => {
  const router = useRouter()

  const handleOnClick = () => {
    if (router.pathname === Routes.HOME) return
    router.replace(Routes.HOME)
  }

  const renderExtra = extra || (
    <Space className="flex-center">
      <Button onClick={handleOnClick}>メインページに戻る</Button>
    </Space>
  )

  return (
    <section className="flex-center size-full">
      <AntdResult
        icon={false}
        title={<h1 className="bold text-3xl text-primary">{title}</h1>}
        subTitle={subTitle}
        extra={renderExtra}
        {...props}
      />
    </section>
  )
}

export default Result

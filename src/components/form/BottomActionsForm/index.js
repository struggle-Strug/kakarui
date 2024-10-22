import { Space } from 'antd'

import { useRouter } from 'next/router'

import { Button } from '@/components/ui'

const BottomActionsForm = ({ onCancel, isEdit, loading }) => {
  const router = useRouter()

  return (
    <Space className="flex-center mt-10 pl-10">
      <Button type="secondary" onClick={onCancel || router.back}>
        戻る
      </Button>
      <Button htmlType="submit" className="mx-auto" loading={loading}>
        {isEdit ? '更新する' : '登録する'}
      </Button>
    </Space>
  )
}

export default BottomActionsForm

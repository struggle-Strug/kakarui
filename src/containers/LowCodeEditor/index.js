import { useEffect, useState } from 'react'

import { API } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useOrganizationQuery } from '@/hooks/query'

import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'

import { LowCodeEditorPresenter } from './LowCodeEditorPresenter'

const LowCodeEditorContainer = () => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()
  const [projects, setProjects] = useState([]) // APIから取得したプロジェクトデータを保存
  const [loading, setLoading] = useState(true) // ローディング状態を管理
  const [error, setError] = useState(null) // エラーメッセージを保存
  // API呼び出しの関数
  const fetchProjects = async () => {
    try {
      const response = await Axios.get(
        buildApiURL(API.SKILL.LIST, { organization_id: organizationId })
      )
      console.log('response', response.data)
      setProjects(response.data || []) // レスポンスデータを状態に保存
    } catch (error) {
      console.error('Error fetching deploy data for projects:', error)
      setError('Failed to fetch projects data.')
    } finally {
      setLoading(false) // ローディング完了
    }
  }

  // コンポーネントがマウントされた時にAPIを呼び出す
  useEffect(() => {
    if (organizationId) {
      fetchProjects()
    }
  }, [organizationId]) // organizationIdが変更された時に再実行

  // エラーが発生した場合の表示
  if (error) {
    console.error(error)
  }
  console.log('organizaitonId', organizationId)
  return <LowCodeEditorPresenter />
}

export default LowCodeEditorContainer

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { API } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useOrganizationQuery } from '@/hooks/query'

import { LowCodeEditorPresenter } from '@/components/low_code_editor'
import { mockSkills } from '@/components/low_code_editor/mockData/MockSkillData'

import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'

const LowCodeEditorContainer = () => {
  const router = useRouter()
  // クエリーパラメータから値を取得
  const { project_id, module_config_id, sequence_id } = router.query

  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()
  const [skillList, setSkillList] = useState([]) // グルーピングされたスキルデータを保存
  const [loading, setLoading] = useState(true) // ローディング状態を管理
  const [error, setError] = useState(null) // エラーメッセージを保存

  // API呼び出しの関数
  const fetchSkillList = async () => {
    try {
      const response = await Axios.get(
        buildApiURL(API.SKILL.LIST, { organization_id: organizationId })
      )

      //NOTE - レスポンスデータが空の場合、モックデータを使用
      let skills = response?.data?.skills
      if (skills.length === 0) {
        skills = mockSkills.skills
      }
      if (skills) {
        setSkillList(skills)
      }
    } catch (error) {
      console.error('Error fetching skills data:', error)
      setError('Failed to fetch skills data.')
    } finally {
      setLoading(false) // ローディング完了
    }
  }

  // コンポーネントがマウントされた時にAPIを呼び出す
  useEffect(() => {
    if (organizationId) {
      fetchSkillList()
    }
  }, [organizationId]) // organizationIdが変更された時に再実行

  // エラーが発生した場合の表示
  if (error) {
    console.error(error)
  }

  return <LowCodeEditorPresenter skills={skillList} loading={loading} />
}

export default LowCodeEditorContainer

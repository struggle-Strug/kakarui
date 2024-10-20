import { useEffect, useState } from 'react'

import { API } from '@/constants'
import { useStubEnabled } from '@/hooks/custom'
import { useOrganizationQuery } from '@/hooks/query'

import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'

import { LowCodeEditorPresenter } from './LowCodeEditorPresenter'
import { mockSkills } from './MockData'

// スキルをタグごとにグルーピングする関数
const groupSkillsByTag = (skills) => {
  return skills.reduce((acc, skill) => {
    const tag = skill.tag || 'unknown'
    if (!acc[tag]) {
      acc[tag] = []
    }
    acc[tag].push(skill)
    return acc
  }, {})
}

const LowCodeEditorContainer = () => {
  const { organizationId } = useOrganizationQuery()
  const { stubEnabled } = useStubEnabled()
  const [groupedSkillList, setGroupedSkillList] = useState({}) // グルーピングされたスキルデータを保存
  const [loading, setLoading] = useState(true) // ローディング状態を管理
  const [error, setError] = useState(null) // エラーメッセージを保存

  // API呼び出しの関数
  const fetchSkillList = async () => {
    try {
      const response = await Axios.get(
        buildApiURL(API.SKILL.LIST, { organization_id: organizationId })
      )
      console.log('response', response.data)

      //NOTE - レスポンスデータが空の場合、モックデータを使用
      let skills = response.data.skills
      if (skills.length === 0) {
        skills = mockSkills.skills
      }
      // タグごとにスキルをグルーピング
      const groupedSkills = groupSkillsByTag(skills)
      setGroupedSkillList(groupedSkills)
    } catch (error) {
      console.error('Error fetching skills data:', error)
      setError('Failed to fetch skills data.')
      // エラーハンドリングとしてモックデータを使用
      const groupedSkills = groupSkillsByTag(mockSkills.skills)
      setGroupedSkillList(groupedSkills)
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

  // groupedSkillListとloadingの状態をログ出力
  console.log('Current groupedSkillList:', groupedSkillList)
  console.log('organizationId:', organizationId)

  return <LowCodeEditorPresenter skills={groupedSkillList} loading={loading} />
}

export default LowCodeEditorContainer

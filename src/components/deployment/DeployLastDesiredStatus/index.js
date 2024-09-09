import { RowContentModal } from '@/components/table'

const DeployLastDesiredStatus = ({ id, item }) => {
  const { code, description } = item || {}
  if (code === 200) return 'デプロイコンプリート'
  if (code === 200 || description === '') return ''

  const copyContent = [`デプロイID: ${id}`, `メッセージ: ${description}`].join('\n')

  return <RowContentModal item={description} copyContent={copyContent} />
}

export default DeployLastDesiredStatus

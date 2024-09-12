import { RowContentModal } from '@/components/table'

import { removeQuotes, stringifyJsonData } from '@/utils/helper/strings'

const DeployLastDesiredStatus = ({ id, item }) => {
  const { code, description } = item || {}
  if (code === 200) return 'Deploy completed'
  if (code === 200 || description === '') return ''

  const descriptionJSON = removeQuotes(stringifyJsonData(description))
  const copyContent = [`デプロイID: ${id}`, `メッセージ: ${descriptionJSON}`].join('\n')

  return <RowContentModal item={descriptionJSON} copyContent={copyContent} />
}

export default DeployLastDesiredStatus

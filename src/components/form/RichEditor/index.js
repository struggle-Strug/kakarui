import { RichEditor as BaseRichEditor } from '@/components/ui'

import FormItem from '../FormItem'

const RichEditor = (props) => {
  return (
    <FormItem {...props}>
      <BaseRichEditor />
    </FormItem>
  )
}

export default RichEditor

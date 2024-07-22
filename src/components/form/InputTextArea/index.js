import { InputTextArea as BaseInputTextArea } from '@/components/ui'

import FormItem from '../FormItem'

const InputTextArea = (props) => {
  return (
    <FormItem {...props}>
      <BaseInputTextArea placeholder={props?.placeholder || '入力してください。'} />
    </FormItem>
  )
}

export default InputTextArea

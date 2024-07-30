import { InputTarFile as BaseInputTarFile } from '@/components/ui'

import FormItem from '../FormItem'

const InputTarFile = (props) => {
  return (
    <FormItem {...props}>
      <BaseInputTarFile />
    </FormItem>
  )
}

export default InputTarFile

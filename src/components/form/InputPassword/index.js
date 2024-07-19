import BaseInputPassword from '@/components/ui/Input/InputPassword'

import FormItem from '../FormItem'

const InputPassword = (props) => {
  return (
    <FormItem {...props}>
      <BaseInputPassword placeholder={props?.placeholder || '********'} />
    </FormItem>
  )
}

export default InputPassword

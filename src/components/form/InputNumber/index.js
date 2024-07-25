import { InputNumber as AntInputNumber } from 'antd'

import FormItem from '../FormItem'

const InputNumber = (props) => {
  return (
    <FormItem {...props}>
      <AntInputNumber size="large" min={0} />
    </FormItem>
  )
}

export default InputNumber

import { Switch as AntSwitch } from 'antd'

import FormItem from '../FormItem'

const Switch = (props) => {
  return (
    <FormItem {...props} keyValue="checked">
      <AntSwitch size="large" />
    </FormItem>
  )
}

export default Switch

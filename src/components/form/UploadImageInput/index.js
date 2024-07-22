import { BaseUploadImage } from '@/components/ui'

import FormItem from '../FormItem'

const UploadImageInput = (props) => {
  return (
    <FormItem {...props}>
      <BaseUploadImage />
    </FormItem>
  )
}

export default UploadImageInput

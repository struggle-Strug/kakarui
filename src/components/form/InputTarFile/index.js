import { forwardRef, useEffect } from 'react'

import { InputTarFile as BaseInputTarFile } from '@/components/ui'

import FormItem from '../FormItem'

const InputTarFile = (props, ref) => {
  return (
    <FormItem {...props}>
      <BaseInputTarFile ref={ref}/>
    </FormItem>
  )
}

export default forwardRef(InputTarFile)

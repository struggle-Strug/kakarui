import { DatePicker as AntDatePicker } from 'antd'

import { forwardRef } from 'react'

import { CalendarIcon } from '@/components/icons'

import FormItem from '../FormItem'

const suffixIcon = <CalendarIcon color="var(--primary)" />

const BaseDatePicker = forwardRef((props, ref) => {
  const render = () => {
    switch (props?.picker) {
      case 'range':
        return (
          <AntDatePicker.RangePicker ref={ref} {...props} suffixIcon={suffixIcon} size="large" />
        )
      default:
        return <AntDatePicker ref={ref} {...props} suffixIcon={suffixIcon} size="large" />
    }
  }

  return render()
})

const DatePicker = (props) => {
  return (
    <FormItem {...props}>
      <BaseDatePicker />
    </FormItem>
  )
}

export default DatePicker

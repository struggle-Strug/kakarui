/* eslint-disable no-nested-ternary */
import { Form } from 'antd'
import dayjs from 'dayjs'

import { Children, cloneElement, useId, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/utils/helper/functions'

import RequiredLabel from '../RequiredLabel'

const FormItem = ({
  name,
  label,
  labelCol,
  disabled,
  wrapperCol,
  formItemProps,
  keyValue = 'value',
  labelAlign,
  className,
  required,
  children,
  style,
  value,
  subLabel,
  labelClassName,
  ...inputProps
}) => {
  const formItemId = useId()
  const child = Children.only(children)

  const { control } = useFormContext() || {}

  const getValidateStatus = (_fieldState) => {
    let validateStatus = ''

    if (_fieldState?.error) {
      validateStatus = 'error'
    }

    if (_fieldState?.isDirty && !_fieldState?.error) {
      validateStatus = 'success'
    }

    return validateStatus
  }

  const getHelpMessage = (_fieldState) => _fieldState?.error?.message

  /* If it is directly assigned to FormItem,
  it will cause the logical judgment of labelCol in props in FormItem to be true,
  so that the set layout will not take effect */

  // eslint-disable-next-line no-shadow
  const getLayoutProps = ({ labelAlign, labelCol, wrapperCol } = {}) => {
    const layoutProps = {}

    if (labelAlign) {
      layoutProps.labelAlign = labelAlign
    }

    if (labelCol) {
      layoutProps.labelCol = labelCol
    }

    if (wrapperCol) {
      layoutProps.wrapperCol = wrapperCol
    }

    return layoutProps
  }

  const layoutProps = getLayoutProps({ labelCol, wrapperCol, labelAlign })

  const renderLabel = useMemo(() => {
    const currentLabel = label ? (
      <div className={cn('text-left', labelClassName)}>
        <p>{label}</p>
        {subLabel ? <span className="text-sm text-dark-gray-2">{subLabel}</span> : null}
      </div>
    ) : null

    return required ? <RequiredLabel {...{ label, subLabel, labelClassName }} /> : currentLabel
  }, [required, label, labelClassName, subLabel])

  return (
    <Controller
      rules={{
        ...(required ? { required: `${label ? `${label}には` : ''}入力してください` } : {}),
      }}
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const validateStatus = getValidateStatus(fieldState)
        const help = getHelpMessage(fieldState)

        const getValue = (_value) => {
          const selectOptions = inputProps?.options
          const defaultValue = inputProps?.defaultValue

          if (Array.isArray(selectOptions) && selectOptions.length > 0) {
            if (Array.isArray(_value) && _value.length > 0) {
              return selectOptions.filter((item) => _value?.includes?.(item.value))
            }
            return selectOptions.find((item) => [_value]?.includes?.(item.value))
          }

          if (inputProps.format) {
            return _value ? dayjs(_value) : defaultValue ? dayjs(defaultValue) : undefined
          }

          return _value
        }

        return (
          <Form.Item
            id={formItemId}
            label={renderLabel}
            name={name}
            help={help}
            validateStatus={validateStatus}
            {...layoutProps}
            {...formItemProps}
          >
            <div>
              {/* div is required to avoid conflict in antd .'s Form.Item */}
              {cloneElement(child, {
                className,
                style,
                ...inputProps,
                ...field,
                disabled,
                [keyValue]: value || getValue(field.value),
              })}
            </div>
          </Form.Item>
        )
      }}
    />
  )
}

export default FormItem

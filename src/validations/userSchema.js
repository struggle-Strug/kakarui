import * as Yup from 'yup'

import { EMAIL_REGEX, MAX_LEN_CONTENT } from '@/constants'

const FORM_INFO = {
  NAME: 'name',
  EMAIL: 'mail',
  ROLE: 'role',
  COMPANY: 'company',
  ENABLE: 'enable',
}

const userValues = {
  [FORM_INFO.NAME]: '',
  [FORM_INFO.EMAIL]: '',
  [FORM_INFO.ROLE]: 'member',
  [FORM_INFO.COMPANY]: '',
}

const userFormSchema = () =>
  Yup.object().shape({
    [FORM_INFO.NAME]: Yup.string()
      .trim()
      .required('氏名を入力してください。')
      .max(MAX_LEN_CONTENT, `無効な入力です。${MAX_LEN_CONTENT}文字以下で入力してください。`),
    [FORM_INFO.EMAIL]: Yup.string()
      .trim()
      .matches(EMAIL_REGEX, '正しいメールアドレスを入力してください。')
      .required('メールアドレスを入力してください。')
      .max(MAX_LEN_CONTENT, `無効な入力です。${MAX_LEN_CONTENT}文字以下で入力してください。`),
    [FORM_INFO.ROLE]: Yup.string()
      .trim()
      .max(100, '無効な入力です。100文字以下で入力してください。'),
    [FORM_INFO.COMPANY]: Yup.string()
      .trim()
      .max(MAX_LEN_CONTENT, `無効な入力です。${MAX_LEN_CONTENT}文字以下で入力してください。`),
  })

export { FORM_INFO, userFormSchema, userValues }

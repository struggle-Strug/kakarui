import * as Yup from 'yup'

import { EMAIL_REGEX, MAX_LEN_CONTENT } from '@/constants'

const FORM_INFO = {
  NAME: 'name',
  EMAIL: 'mail',
  ROLE: 'role',
  SUB_ROLE: 'sub_role',
  COMPANY: 'company',
  ENABLE: 'enable',
}

const userValues = {
  [FORM_INFO.NAME]: '',
  [FORM_INFO.EMAIL]: '',
  [FORM_INFO.ROLE]: 'member',
  [FORM_INFO.SUB_ROLE]: false,
  [FORM_INFO.COMPANY]: '',
}

const userFormSchema = () =>
  Yup.object().shape({
    [FORM_INFO.NAME]: Yup.string()
      .trim()
      .required('氏名を入力してください。')
      .max(MAX_LEN_CONTENT, `${MAX_LEN_CONTENT}文字以下を入力してください。`),
    [FORM_INFO.EMAIL]: Yup.string()
      .trim()
      .required('メールアドレスを入力してください。')
      .matches(EMAIL_REGEX, 'メールアドレスの形式を正しく入力してください。')
      .max(64, `${64}文字以下を入力してください。`),
    [FORM_INFO.ROLE]: Yup.string().trim().max(100, `${100}文字以下を入力してください。`),
    [FORM_INFO.COMPANY]: Yup.string()
      .trim()
      .nullable()
      .notRequired()
      .max(64, `${64}文字以下を入力してください。`),
  })

export { FORM_INFO, userFormSchema, userValues }

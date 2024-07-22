import * as Yup from 'yup'

const FORM_INFO = {
  NAME: 'name',
  DESCRIPTION: 'description',
  TAG: 'tag',
  FILE: 'file',
}

const moduleValues = {}

const moduleFormSchema = () =>
  Yup.object().shape({
    [FORM_INFO.NAME]: Yup.string()
      .required('モジュール名を入力してください。')
      .max(50, '無効な入力です。50文字以下で入力してください。'),
    [FORM_INFO.DESCRIPTION]: Yup.string().max(
      4000,
      '無効な入力です。4000文字以下で入力してください。'
    ),
    [FORM_INFO.TAG]: Yup.string().required('タグを入力してください。'),
  })

export { moduleFormSchema, moduleValues, FORM_INFO }

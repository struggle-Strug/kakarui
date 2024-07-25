import * as Yup from 'yup'

const FORM_INFO = {
  PROJECT_NAME: 'name',
  DESCRIPTION: 'description',
}

const projectValues = {
  [FORM_INFO.PROJECT_NAME]: '',
  [FORM_INFO.DESCRIPTION]: '',
}

const projectFormSchema = () =>
  Yup.object().shape({
    [FORM_INFO.PROJECT_NAME]: Yup.string()
      .required('プロジェクト名を入力してください。')
      .max(50, `${50}文字以下を入力してください。`),
    [FORM_INFO.DESCRIPTION]: Yup.string().max(4000, `${4000}文字以下を入力してください。`),
  })

export { projectFormSchema, projectValues, FORM_INFO }

import * as Yup from 'yup'

const FORM_INFO = {
  ID: 'id',
  NAME: 'name',
  DESCRIPTION: 'description',
  TAG: 'tag',
  FILE: 'file',
  CONFIG_DATA: 'config_data',
}

const moduleFormSchema = (isEdit) =>
  isEdit
    ? Yup.object().shape({
        [FORM_INFO.ID]: Yup.string().trim().required(),
        [FORM_INFO.NAME]: Yup.string()
          .trim()
          .required('モジュール名を入力してください。')
          .max(4000, `4000文字以下で入力してください。`),
        [FORM_INFO.DESCRIPTION]: Yup.string()
          .trim()
          .nullable()
          .max(4000, '4000文字以下で入力してください。'),
        [FORM_INFO.TAG]: Yup.string()
          .trim()
          .required('タグを入力してください。')
          .max(128, `128文字以下を入力してください。`),
        [FORM_INFO.FILE]: Yup.mixed().required('ファイルを入力してください。'),
      })
    : Yup.object().shape({
        [FORM_INFO.NAME]: Yup.string()
          .trim()
          .required('モジュール名を入力してください。')
          .max(4000, `4000文字以下で入力してください。`),
        [FORM_INFO.DESCRIPTION]: Yup.string()
          .trim()
          .nullable()
          .max(4000, '4000文字以下で入力してください。'),
        [FORM_INFO.TAG]: Yup.string()
          .trim()
          .required('タグを入力してください。')
          .max(128, `128文字以下を入力してください。`),
        [FORM_INFO.FILE]: Yup.mixed().required('ファイルを入力してください。'),
      })

const moduleSettingSchema = Yup.object().shape({
  [FORM_INFO.CONFIG_DATA]: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().trim().required('入力してください。'),
      value: Yup.string().trim().required('入力してください。'),
    })
  ),
})

export { moduleFormSchema, moduleSettingSchema, FORM_INFO }

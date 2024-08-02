import * as Yup from 'yup'

const FORM_MODULE_CONFIG = {
  NAME: 'name',
  DESCRIPTION: 'description',
  CONFIG_DATA: 'config_data',
  CREATE_DATE: 'create_date',
  UPDATE_DATE: 'update_date',
}

const moduleSchema = Yup.object().shape({
  module_instance: Yup.string()
    .trim()
    .required('インスタンス名を入力してください。')
    .max(1024, `1024文字以下を入力してください。`),
  type: Yup.string(),
  config_data: Yup.object().required('設定値を入力してください。'),
})

const moduleConfigSchema = Yup.object().shape({
  [FORM_MODULE_CONFIG.NAME]: Yup.string()
    .trim()
    .required('モジュール配置名を入力してください。')
    .max(50, `50文字以下を入力してください。`),
  [FORM_MODULE_CONFIG.DESCRIPTION]: Yup.string()
    .trim()
    .max(4000, '4000文字以下で入力してください。'),
  [FORM_MODULE_CONFIG.CONFIG_DATA]: Yup.object().shape({
    modules: Yup.array().of(moduleSchema).min(1, 'モジュールを追加してください。'),
  }),
  // [FORM_MODULE_CONFIG.CREATE_DATE]: Yup.date(),
  // [FORM_MODULE_CONFIG.UPDATE_DATE]: Yup.date(),
})

export { moduleConfigSchema, FORM_MODULE_CONFIG }

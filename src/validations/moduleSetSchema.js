import * as Yup from 'yup'

const FORM_MODULE_SET = {
  NAME: 'name',
  DESCRIPTION: 'description',
  MODULESET_MODULES: 'moduleset_modules',
}

const moduleSchema = Yup.object().shape({
  module_id: Yup.string().required('モジュールを入力してください。'),
  tag: Yup.string().required('タグを入力してください。'),
  type: Yup.string(),
  default_config_data: Yup.object().required('設定値を入力してください。'),
})

const moduleSetSchema = Yup.object().shape({
  [FORM_MODULE_SET.NAME]: Yup.string().trim().required().max(50),
  [FORM_MODULE_SET.DESCRIPTION]: Yup.string().trim().max(4000),
  [FORM_MODULE_SET.MODULESET_MODULES]: Yup.array().of(moduleSchema),
})

export { moduleSetSchema, FORM_MODULE_SET }

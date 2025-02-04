import * as Yup from 'yup'

const FORM_MODULE_SET = {
  NAME: 'name',
  DESCRIPTION: 'description',
  MODULESET_MODULES: 'moduleset_modules',
}

const moduleSchema = Yup.object().shape({
  tag: Yup.string()
    .trim()
    .max(128, `128文字以下を入力してください。`)
    .required('タグを入力してください。'),
  type: Yup.string(),
  default_config_data: Yup.object().required('設定値を入力してください。'),
  is_deleted: Yup.bool(),
})

const moduleSetSchema = Yup.object().shape({
  [FORM_MODULE_SET.NAME]: Yup.string()
    .trim()
    .required('モジュールセット名を入力してください。')
    .max(50, `50文字以下を入力してください。`),
  [FORM_MODULE_SET.DESCRIPTION]: Yup.string().trim().max(4000, '4000文字以下で入力してください。'),
  [FORM_MODULE_SET.MODULESET_MODULES]: Yup.array()
    .of(moduleSchema)
    .test(
      'no-deleted-modules',
      '削除されたモジュールが含まれています。',
      (modules) => modules.every((module) => !module.is_deleted) // 配列内に is_deleted が true のモジュールがないことを確認
    ),
})

export { moduleSetSchema, FORM_MODULE_SET }

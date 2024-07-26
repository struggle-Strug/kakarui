import * as Yup from 'yup'

const FORM_DEPLOY = {
  NAME: 'name',
  DESCRIPTION: 'description',
  MODULE_CONFIG: 'module_config_id',
  TYPE: 'type',
  ROBOT: 'robot_id',
}

const deployFormSchema = () =>
  Yup.object().shape({
    [FORM_DEPLOY.MODULE_CONFIG]: Yup.string()
      .trim()
      .required('モジュール配置名を選択してください。'),
    [FORM_DEPLOY.TYPE]: Yup.string().trim().required('デプロイ先タイプを選択してください。'),
    [FORM_DEPLOY.ROBOT]: Yup.string().trim().required('デプロイ先モデルを選択してください。'),
  })

export { FORM_DEPLOY, deployFormSchema }

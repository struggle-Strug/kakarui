import * as Yup from 'yup'

import { DEPLOYMENT_MODEL_OPTIONS } from '@/constants'

const FORM_INFO = {
  PROJECT_NAME: 'name',
  DESCRIPTION: 'description',
  MODEL: 'model',
  TYPE: 'type',
  MODULE: 'module',
}

const deployValues = {
  [FORM_INFO.PROJECT_NAME]: 'プロト1.5',
  [FORM_INFO.DESCRIPTION]: '荷物の運搬、把持、配置を行うモジュール配置定義。',
  [FORM_INFO.MODEL]: DEPLOYMENT_MODEL_OPTIONS[0].value,
}

const deployFormSchema = () =>
  Yup.object().shape({
    [FORM_INFO.TYPE]: Yup.string().required('デプロイ先タイプを選択してください。'),
    [FORM_INFO.MODULE]: Yup.string().required('モジュール配置名を選択してください。'),
    [FORM_INFO.MODEL]: Yup.string().default(DEPLOYMENT_MODEL_OPTIONS[0].value),
  })

export { FORM_INFO, deployFormSchema, deployValues }

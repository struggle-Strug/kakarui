import * as Yup from 'yup'

const FORM_MODULE_CONFIG = {
  NAME: 'name',
  DESCRIPTION: 'description',
  CREATE_DATE: 'create_date',
  UPDATE_DATE: 'update_date',
}

const moduleConfigSchema = () =>
  Yup.object().shape({
    [FORM_MODULE_CONFIG.NAME]: Yup.string().trim().required().max(50),
    [FORM_MODULE_CONFIG.DESCRIPTION]: Yup.string().trim().max(4000),
    [FORM_MODULE_CONFIG.CREATE_DATE]: Yup.date(),
    [FORM_MODULE_CONFIG.UPDATE_DATE]: Yup.date(),
  })

export { moduleConfigSchema, FORM_MODULE_CONFIG }

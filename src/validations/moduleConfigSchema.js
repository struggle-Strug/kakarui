import * as Yup from 'yup'

const FORM_MODULE_CONFIG = {
  NAME: 'name',
  DESCRIPTION: 'description',
}

const moduleConfigSchema = () =>
  Yup.object().shape({
    [FORM_MODULE_CONFIG.NAME]: Yup.string().trim().required().max(50),
    [FORM_MODULE_CONFIG.DESCRIPTION]: Yup.string().trim().max(4000),
  })

export { moduleConfigSchema, FORM_MODULE_CONFIG }

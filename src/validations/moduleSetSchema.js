import * as Yup from 'yup'

const FORM_MODULE_SET = {
  NAME: 'name',
  DESCRIPTION: 'description',
}

const moduleSetSchema = () =>
  Yup.object().shape({
    [FORM_MODULE_SET.NAME]: Yup.string().trim().required().max(50),
    [FORM_MODULE_SET.DESCRIPTION]: Yup.string().trim().max(4000),
  })

export { moduleSetSchema, FORM_MODULE_SET }

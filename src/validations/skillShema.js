import * as Yup from 'yup'

const FORM_SKILL = {
  NAME: 'name',
  DESCRIPTION: 'description',
  SCHEMA: 'schema',
  VISIBILITY: 'visibility',
  TAG: 'tag',
}

const skillSchema = () =>
  Yup.object().shape({
    [FORM_SKILL.NAME]: Yup.string().trim().required('スキル名を入力してください。'),
    [FORM_SKILL.DESCRIPTION]: Yup.string().trim().required('スキル説明を入力してください。'),
    [FORM_SKILL.SCHEMA]: Yup.string()
      .trim()
      .required('スキーマを入力してください。')
      .test('is-json', '正しいJSON形式を入力してください。', (value) => {
        if (!value) return false
        try {
          JSON.parse(value)
          return true
        } catch (e) {
          return false
        }
      }),
    [FORM_SKILL.TAG]: Yup.string().trim().required('タグを入力してください。'),
    [FORM_SKILL.VISIBILITY]: Yup.string().trim().required('参照範囲を入力してください。'),
  })

export { FORM_SKILL, skillSchema }

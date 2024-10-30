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
        [FORM_SKILL.NAME]: Yup.string()
            .trim()
            .required('氏名を入力してください。'),
        [FORM_SKILL.DESCRIPTION]: Yup.string()
            .trim()
            .required('説明を入力してください。'),
        [FORM_SKILL.SCHEMA]: Yup.string()
            .trim()
            .required('スキーマを入力してください。'),
        [FORM_SKILL.VISIBILITY]: Yup.string()
            .trim()
            .required('可視性を入力してください。'),
        [FORM_SKILL.TAG]: Yup.string()
            .trim()
            .required('タグを入力してください。'),
    })


export { FORM_SKILL, skillSchema }

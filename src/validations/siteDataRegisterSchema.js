import * as Yup from 'yup'

const FORM_INFO = {
    AREA: 'area',
    VISIBILITY: 'visibility',
    TYPE: 'type',
    VALUE: 'value',
    KEY: 'key',
    DESCRIPTION: 'description'
}

const sitedataRegisterSchema = () => {
    return Yup.object().shape({
            [FORM_INFO.AREA]: Yup.string().trim().required('サイト名を選択してください。'),
            [FORM_INFO.KEY]: Yup.string()
            .trim()
            .required('データを入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.VALUE]: Yup.string()
            .trim()
            .required('設定値を入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.DESCRIPTION]: Yup.string()
            .trim()
            .required('サイト説明を入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
          })
}


export { FORM_INFO, sitedataRegisterSchema }
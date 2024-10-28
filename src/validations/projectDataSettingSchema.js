import * as Yup from 'yup'

const FORM_INFO = {
    NAME: 'name',
    KEY: 'key',
    VALUE: 'value',
    DESCRIPTION: 'description'
}

const projectDataSettingSchema = () => {
    return Yup.object().shape({
            [FORM_INFO.NAME]: Yup.string().trim().required('プロジェクト名を選択してください。'),
            [FORM_INFO.KEY]: Yup.string()
            .trim()
            .required('プロジェクトデータ名を入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.VALUE]: Yup.string()
            .trim()
            .required('設定値を入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.DESCRIPTION]: Yup.string()
            .trim()
            .max(4000, '4000文字以下で入力してください。'),
          })
}


export { FORM_INFO, projectDataSettingSchema }
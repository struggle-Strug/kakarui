import * as Yup from 'yup'

import { JapaneseRegex } from '@/constants'

const FORM_INFO = {
    SITENAME: 'sitename',
    SITEDATANAME: 'sitedataname',
    VISBILITY: 'visbility',
    VALUE: 'value',
    DATA: 'data',
    DESCRIPTION: 'description'
}

const sitedataRegisterSchema = (isEdit) => {
    isEdit 
        ? Yup.object().shape({
            [FORM_INFO.SITENAME]: Yup.string().trim().required('サイト名を選択してください。'),
            [FORM_INFO.SITEDATANAME]: Yup.string()
                .trim()
                .required('サイトデータ名を入力してください。')
                .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.VALUE]: Yup.string()
            .trim()
            .required('設定値を入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.DATA]: Yup.string()
                .trim()
                .required('データを入力してください。')
                .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.DESCRIPTION]: Yup.string()
            .trim()
            .required('サイト説明を入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
          })
        : Yup.object().shape({
            [FORM_INFO.SITENAME]: Yup.string().trim().required('サイト名を選択してください。'),
            [FORM_INFO.SITEDATANAME]: Yup.string()
                .trim()
                .required('サイトデータ名を入力してください。')
                .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.VALUE]: Yup.string()
            .trim()
            .required('設定値を入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.DATA]: Yup.string()
                .trim()
                .required('データを入力してください。')
                .max(4000, '4000文字以下で入力してください。'),
            [FORM_INFO.DESCRIPTION]: Yup.string()
            .trim()
            .required('サイト説明を入力してください。')
            .max(4000, '4000文字以下で入力してください。'),
          })
}


export { FORM_INFO, sitedataRegisterSchema }
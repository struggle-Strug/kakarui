import * as Yup from 'yup'

const FORM_SAVE_SEQUENCE = {
  NAME: 'name',
  DESCRIPTION: 'description',
  SCHEMA: 'schema', // JSONフィールド
}

const saveSequenceFormSchema = () =>
  Yup.object().shape({
    [FORM_SAVE_SEQUENCE.NAME]: Yup.string()
      .trim()
      .required('シーケンス名を入力してください。')
      .max(50, 'シーケンス名は50文字以内で入力してください。'), // 最大50文字に制限
    [FORM_SAVE_SEQUENCE.DESCRIPTION]: Yup.string()
      .trim()
      .max(4000, 'シーケンス説明は4000文字以内で入力してください。') // 最大4000文字に制限、任意項目
      .nullable(), // 任意入力に設定（空の場合も許可）
    [FORM_SAVE_SEQUENCE.SCHEMA]: Yup.string()
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
      }), // JSON形式をチェックするバリデーション
  })

export { FORM_SAVE_SEQUENCE, saveSequenceFormSchema }

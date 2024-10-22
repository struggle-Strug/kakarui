import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Spin } from 'antd'

import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { API } from '@/constants'

import { Input, InputTextArea } from '@/components/form'
import { Button } from '@/components/ui'

import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
// エンドポイントを構築する関数
import { FORM_SAVE_SEQUENCE, saveSequenceFormSchema } from '@/validations/saveSequenceSchema'

const SaveSequence = ({ isEdit, data, onClose, organizationId, projectId, moduleConfigId }) => {
  //TODO - projectIdとmoduleConfigIdをhookか何かで取得する
  //   const { organizationId } = useOrganizationQuery() || {}
  //TODO - シーケンスデータを取得しjsonを出力する処理を実装

  const defaultValues = useMemo(
    () => ({
      [FORM_SAVE_SEQUENCE.NAME]: data?.name || '',
      [FORM_SAVE_SEQUENCE.DESCRIPTION]: data?.description || '',
      [FORM_SAVE_SEQUENCE.SCHEMA]: JSON.stringify(data?.schema, null, 2) || '', // JSONのフォーマットを整えて表示
    }),
    [data]
  )

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(saveSequenceFormSchema()), // バリデーションスキーマを適用
    defaultValues,
  })
  const { reset } = methods
  const onSubmit = async (values) => {
    try {
      // URLパラメータの確認
      if (!organizationId || !projectId || !moduleConfigId) {
        throw new Error('URLパラメータが不足しています')
      }

      const schemaValue = JSON.parse(values[FORM_SAVE_SEQUENCE.SCHEMA]) // JSONに変換して送信
      const params = {
        name: values[FORM_SAVE_SEQUENCE.NAME],
        description: values[FORM_SAVE_SEQUENCE.DESCRIPTION],
        schema: schemaValue, // JSONを含むオブジェクトとして送信
      }
      // APIエンドポイントのURLを構築
      const response = await Axios.post(
        buildApiURL(API.SEQUENCE.CREATE, {
          organization_id: organizationId,
          project_id: projectId,
          module_config_id: moduleConfigId,
        }),
        params
      )
      console.log('成功:', response.data)
      //TODO - フォーム登録後に値をクリアする場合は以下を使用
      //   reset()
      onClose() // フォームを閉じる
    } catch (error) {
      console.error('エラーが発生しました:', error)
      // エラーハンドリングを追加する
    }
  }

  const renderForm = (
    <FormProvider {...methods}>
      <Form
        onFinish={methods.handleSubmit(onSubmit)}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        className="item-start"
        layout="horizontal"
        labelAlign="left"
        colon={false}
        labelWrap
      >
        <Input
          name={FORM_SAVE_SEQUENCE.NAME}
          label="シーケンス名:"
          placeholder="シーケンス名を入力してください。"
          disabled={isEdit}
        />

        <InputTextArea
          label="シーケンス説明:"
          name={FORM_SAVE_SEQUENCE.DESCRIPTION}
          placeholder="シーケンス説明を入力してください。"
          rows={3}
          disabled={isEdit}
        />

        <InputTextArea
          label="スキーマ (JSON形式):"
          name={FORM_SAVE_SEQUENCE.SCHEMA}
          placeholder="スキーマをJSON形式で入力してください。"
          rows={6} // JSONフィールド用に行数を多くする
          disabled={isEdit}
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px] text-primary" onClick={onClose}>
            <span className="font-semibold">キャンセル</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]">
            <span className="font-semibold">{isEdit ? '更新' : '登録'}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return <Spin spinning={false}>{renderForm}</Spin>
}

export default SaveSequence

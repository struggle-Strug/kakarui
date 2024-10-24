import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Spin, Button, Checkbox, Input } from 'antd'

import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useOrganizationQuery } from '@/hooks/query'

import { API } from '@/constants'

// import { Input, InputTextArea } from '@/components/form'
// import { Button } from '@/components/ui'

import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
// エンドポイントを構築する関数
import { FORM_SAVE_SEQUENCE, saveSequenceFormSchema } from '@/validations/saveSequenceSchema'

const SaveSequence = ({ isEdit, data, onClose, projectId, moduleConfigId, nodes }) => {

  //TODO - projectIdとmoduleConfigIdをhookか何かで取得する
  const { organizationId } = useOrganizationQuery() || {}
  //TODO - シーケンスデータを取得しjsonを出力する処理を実装

  const defaultValues = useMemo(
    () => ({
      [FORM_SAVE_SEQUENCE.NAME]: data?.name || '',
      [FORM_SAVE_SEQUENCE.DESCRIPTION]: data?.description || '',
      [FORM_SAVE_SEQUENCE.SCHEMA]: JSON.stringify(data?.schema, null, 2) || '', // JSONのフォーマットを整えて表示
    }),
    [data]
  )

  // const methods = useForm({
  //   mode: 'onChange',
  //   resolver: yupResolver(saveSequenceFormSchema()), // バリデーションスキーマを適用
  //   defaultValues,
  // })
  // const { reset } = methods
  // const onSubmit = async () => {
  //   console.log('ddddddddddddd');

  //   try {
  //     // URLパラメータの確認
  //     if (!organizationId || !projectId || !moduleConfigId) {
  //       throw new Error('URLパラメータが不足しています')
  //     }

  //     const schemaValue = JSON.parse(values[FORM_SAVE_SEQUENCE.SCHEMA]) // JSONに変換して送信
  //     const params = {
  //       name: values[FORM_SAVE_SEQUENCE.NAME],
  //       description: values[FORM_SAVE_SEQUENCE.DESCRIPTION],
  //       schema: schemaValue, // JSONを含むオブジェクトとして送信
  //       nodes
  //     }
  //     // APIエンドポイントのURLを構築
  //     const response = await Axios.post(
  //       buildApiURL(API.SEQUENCE.CREATE, {
  //         organization_id: organizationId,
  //         project_id: projectId,
  //         module_config_id: moduleConfigId,
  //       }),
  //       params
  //     )
  //     console.log('成功:', response.data)
  //     //TODO - フォーム登録後に値をクリアする場合は以下を使用
  //     //   reset()
  //     onClose() // フォームを閉じる
  //   } catch (error) {
  //     console.error('エラーが発生しました:', error)
  //     // エラーハンドリングを追加する
  //   }
  // }
  const onFinish = async (values) => {
    console.log(values, organizationId, projectId, moduleConfigId);

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
        nodes
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
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const renderForm = (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label={FORM_SAVE_SEQUENCE.NAME}
        name={FORM_SAVE_SEQUENCE.NAME}
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={FORM_SAVE_SEQUENCE.NAME}
        name={FORM_SAVE_SEQUENCE.NAME}
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
  return <Spin spinning={false}>{renderForm}</Spin>
}

export default SaveSequence

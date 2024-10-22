import { Form, Modal, message } from 'antd'

import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react';

import { ACTIVE_STATUS, ACTIVE_STATUS_OPTIONS, USER_ROLE, USER_ROLE_OPTIONS } from '@/constants'
import { useUserDelete, usePermissionDelete, useUserDetailCount, useAuth} from '@/hooks/query'
import { useFlag } from '@/hooks/share'

import { Checkbox, Input, Select } from '@/components/form'
import { TrashIcon } from '@/components/icons'
import { Button, ButtonIcon } from '@/components/ui'

import { FORM_INFO } from '@/validations/userSchema'

const formText = {
  title: 'ユーザー削除確認',
  description: '以下のユーザを削除します',
  description2: '削除したユーザが作成したモジュールはそのまま残留します。',
  company_name_label: '会社名:',
  name_label: '氏名:',
  email_label: 'メールアドレス:',
  role_label: 'ロール:',
  status_label: 'ステータス:',
  sub_role_label: 'サブロール:',
  delete_button: ' 削除 ',
  cancel_button: 'キャンセル',
}

const UserDeleteCheckModalButton = ({ data, onSuccess }) => {
  const { id } = useAuth()
  const [userCount, setUserCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [open, onOpen, onClose] = useFlag()

  const defaultValues = useMemo(
    () => (data)
  )

  const role = data.main_role;

  const { doDeleteUser } = useUserDelete({
    onSuccess: () => {
      message.success('ユーザを削除しました。')
      onClose()
      onSuccess?.()
    },
  })

  const { doDetailUserCount, isPending, isSuccess } = useUserDetailCount(
    {
    onSuccess: (count) => {
      setUserCount(count);
    },
  }
)

  const { doDeletePermission } = usePermissionDelete(
    {
    onSuccess: () => {
      if (userCount != 1) {
        message.success('所属ユーザを削除しました。')
        onClose()
      } else {
        
      }
      onSuccess?.()
    },
  }
)

  const methods = useForm(defaultValues)

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues]
)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// userCountが更新されたら削除処理を実行
useEffect(() => {
  const performDeleteOperations = async () => {
  if (userCount !== null) {
    try {
      // await doDeletePermission(defaultValues);
      if (userCount === 1) {
        console.log("Attempting to delete user...");
        // await delay(3000);
        await doDeleteUser(defaultValues);
      }
    } catch (error) {
      console.error('Error during delete operations:', error);
    } finally {
      setIsLoading(false);
    }
  }
};

  performDeleteOperations()
}, [userCount, doDeletePermission, doDeleteUser, defaultValues])

  const onSubmit = async (values) => {
    try{
      setIsLoading(true);

      // await doDetailUserCount(values)
      // ユーザカウントを取得
    const count = await doDetailUserCount(values);
    console.log("count: ",count)
    // setUserCount(count);

    // if (userCount !== null) {
    //   setUserCount(userCount);

    //   // ここで 1 秒（1000ms）待機する
    //   await delay(1000);

    //   // doDeletePermissionを実行
    //   await doDeletePermission(values);

    //   console.log("count: ",userCount)
    //   // userCountが1の場合にのみユーザー削除処理を実行
    //   if (userCount === 1) {
    //     await doDeleteUser(values);
    //   }
    // }

      // // userCount の更新を監視し、null ではなくなったら次の処理に進む
      // if (userCount !== null) {
      // // doDeletePermission の実行

      //   await doDeletePermission(values);

      //   await delay(5000);
        
      //   // userCount が1の場合はユーザー削除処理を実行
      //   if (userCount === 1) {
      //     await doDeleteUser(values);
      //   }
      // }

      // await new Promise((resolve) => {
      //   const interval = setInterval(() => {
      //     if (userCount !== null) {
      //       clearInterval(interval)
      //       resolve()
      //     }
      //   }, 500)
      // })

      // const ms = 3000;
      // new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, ms)
      // }).then(() => {
      //   doDeletePermission(values);
      // });      

      // new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 4000)
      // }).then(() => {
      //   if (userCount === 1) {
      //     doDeleteUser(values)
      //   }
      // });

      
      
    } catch (error) {
      console.error('Error delete user:', error)
    } finally {
      // ローディングを終了
      setIsLoading(false);
    }
      
  }
  const renderForm = (
    <FormProvider {...methods}>
      <Form
        onFinish={methods.handleSubmit(onSubmit)}
        labelCol={{ flex: '172px' }}
        wrapperCol={{ flex: 1 }}
        layout="horizontal"
        labelAlign="left"
        colon={false}
        labelWrap
        disabled={isLoading}
      >
        <Input
          name={FORM_INFO.COMPANY}
          label={formText.company_name_label}
          placeholder="会社名を入力してください。"
          disabled
        />

        <Input
          name={FORM_INFO.NAME}
          label={formText.name_label}
          placeholder="氏名を入力してください。"
          disabled
        />

        <Input
          name={FORM_INFO.EMAIL}
          label={formText.email_label}
          placeholder="メールアドレスを入力してください。"
          disabled
        />

        <Select
          name={FORM_INFO.ROLE}
          label={formText.role_label}
          options={USER_ROLE_OPTIONS}
          placeholder="ロールを選択してください。"
          defaultValue={role}
          disabled
        />

        <Checkbox
          name={FORM_INFO.SUB_ROLE}
          label={formText.sub_role_label}
          title="デプロイ管理者"
          disabled
        />

        <Select
          name="status"
          label={formText.status_label}
          options={ACTIVE_STATUS_OPTIONS}
          placeholder="ステータスを選択してください。"
          defaultValue={ACTIVE_STATUS.ENABLE.toString()}
          disabled
        />

        <div className="flex-end mt-12 gap-x-4">
          <Button type="default" className="min-w-[200px]" onClick={onClose}>
            <span className="font-semibold">{formText.cancel_button}</span>
          </Button>
          <Button type="primary" htmlType="submit" className="min-w-[200px]" loading={isLoading}>
            <span className="font-semibold">{formText.delete_button}</span>
          </Button>
        </div>
      </Form>
    </FormProvider>
  )

  return (
    <>
      <ButtonIcon icon={<TrashIcon />} onClick={onOpen} disabled={id == data.entra_id} />
      <Modal
        open={open}
        onCancel={onClose}
        title={<h1 className="text-lg font-semibold text-dark-gray-3">{formText.title}</h1>}
        className="rounded-3xl"
        footer={null}
        width={698}
        data={data}
      >
        <p className="px-12 text-lg font-light text-primary">{formText.description}</p>
        <p className="px-12 text-lg font-light text-primary">{formText.description2}</p>
        <div className="p-12 font-light">{renderForm}</div>
      </Modal>
    </>
  )
}

export default UserDeleteCheckModalButton

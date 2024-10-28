import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Spin } from 'antd'

import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { DEPLOYMENT_TYPE_OPTIONS } from '@/constants'
import {
    useDeployStart,
    useModuleConfigQuery,
    useProjectActive,
    useRobotActive,
    useRobotQuery,
} from '@/hooks/query'

import { Input, InputTextArea, Select } from '@/components/form'
import { Button } from '@/components/ui'

import { FORM_DEPLOY, deployFormSchema } from '@/validations/deploySchema'

const SkillForm = ({ isEdit, data, onClose }) => {
    const { data: moduleConfigs, getModuleConfigOptions } = useModuleConfigQuery()
    const { getRobotOptions } = useRobotQuery()

    const moduleConfigOptions = getModuleConfigOptions()
    const robotOptions = getRobotOptions()

    const { projectActive } = useProjectActive()
    const { robotActive } = useRobotActive()

    const defaultValues = useMemo(
        () => ({
            [FORM_DEPLOY.NAME]: projectActive?.name || '',
            [FORM_DEPLOY.MODULE_CONFIG]: data?.id,
            [FORM_DEPLOY.DESCRIPTION]: data?.description || '',
            [FORM_DEPLOY.TYPE]: robotActive?.type || '',
            [FORM_DEPLOY.ROBOT]: robotActive?.id,
        }),
        [data, projectActive?.name, robotActive?.id]
    )

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(deployFormSchema()),
        defaultValues,
    })

    useEffect(() => {
        methods.reset(defaultValues)
    }, [defaultValues])

    const { doDeployStart, isPending } = useDeployStart({
        onSuccess: () => {
            methods.reset({})
            onClose()
        },
    })

    const onSubmit = (values) => {
        doDeployStart(values)
    }

    const moduleConfigIdWatch = methods.watch(FORM_DEPLOY.MODULE_CONFIG)

    useEffect(() => {
        if (moduleConfigIdWatch === data?.id) return

        const moduleConfigActive = moduleConfigs.find((m) => m?.id === moduleConfigIdWatch)
        methods.setValue(FORM_DEPLOY.DESCRIPTION, moduleConfigActive?.description)
    }, [moduleConfigIdWatch, data?.id, moduleConfigs])

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
                    name={FORM_DEPLOY.NAME}
                    label="プロジェクト名:"
                    placeholder="プロジェクト名を入力してください。"
                    disabled
                />

                <Select
                    name={FORM_DEPLOY.MODULE_CONFIG}
                    label="モジュール配置名:"
                    placeholder="モジュール配置名を選択してください。"
                    options={moduleConfigOptions}
                />

                <InputTextArea
                    label="説明:"
                    name={FORM_DEPLOY.DESCRIPTION}
                    placeholder="説明を入力してください。"
                    rows={3}
                    disabled
                />

                <Select
                    name={FORM_DEPLOY.TYPE}
                    label="デプロイ先タイプ:"
                    options={DEPLOYMENT_TYPE_OPTIONS}
                    placeholder="デプロイ先タイプを選択してください。"
                />

                <Select
                    name={FORM_DEPLOY.ROBOT}
                    label="デプロイ先モデル:"
                    placeholder="デプロイ先モデルを入力してください。"
                    options={robotOptions}
                    disabled
                />

                <div className="flex-end mt-12 gap-x-4">
                    <Button type="default" className="min-w-[200px] text-primary" onClick={onClose}>
                        <span className="font-semibold">キャンセル</span>
                    </Button>
                    <Button type="primary" htmlType="submit" className="min-w-[200px]">
                        <span className="font-semibold">{isEdit ? 'デプロイ' : 'デプロイ'}</span>
                    </Button>
                </div>
            </Form>
        </FormProvider>
    )

    return <Spin spinning={isPending}>{renderForm}</Spin>
}

export default SkillForm

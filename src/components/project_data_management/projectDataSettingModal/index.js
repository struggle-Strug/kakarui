import { Input, Select } from "@/components/form";
import { Button } from "@/components/ui";
import { useProjectDataCreate, useProjectDataUpdate } from "@/hooks/query/projectdata";
import { FORM_INFO, projectDataSettingSchema } from "@/validations/projectDataSettingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Modal, Spin } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const initValue = {
    name: '',
    value: '',
    key: '',
}

const ProjectDataSettingModal = ({open, onClose, data, projectNames, onRefresh}) => {
    
    const isEdit = useMemo(() => {
        if(data) return true
        return false
    }, [data])

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(projectDataSettingSchema()),
        defaultValues: { ...initValue },
    })

    useEffect(() => {
        if (!open) {
            methods.reset(initValue);  // Reset to initial values when the modal is closed
        }
    }, [open]);

    const defaultValue = data
        ? {
            name: data.name,
            value: data.value,
            key: data.key,
        }
        : { ...initValue }
    useEffect(() => {
        methods.reset(defaultValue)
    },[data])

    const { doCreateProjectData, isPending: createLoading } = useProjectDataCreate({
        onSuccess: (data) => {
          onClose(data)
          onRefresh()
        },
    })

    const { doUpdataProjectData, isPending: updateLoading } = useProjectDataUpdate({
        onSuccess: (data) => {
          onClose(data)
          onRefresh()
        },
    })

    const onSubmit = useCallback(
        async (values) => {
          if (isEdit) {
            doUpdataProjectData({...values, data_id: data.data_id, project_id: data.project_id})
            return
          }
          doCreateProjectData(values)
        },
        [doCreateProjectData, doUpdataProjectData, isEdit]
    )
    

    return ( 
        <Modal 
            open={open}
            onCancel={() => onClose()}
            title={<h1 className="text-lg font-semibold text-dark-gray-3">プロジェクトデータ設定</h1>}
            className="rounded-3xl"
            footer={null}
            width={698}
        >
        <p className="px-12 text-lg font-light text-primary">プロジェクトデータを設定します。</p>
        <div className="p-12 pr-20 font-light">
            <Spin
                spinning={createLoading || updateLoading}
            >
                <FormProvider {...methods}>
                    <Form
                        onFinish={methods.handleSubmit(onSubmit)}
                        labelCol={{ flex: '164px' }}
                        wrapperCol={{ flex: 1 }}
                        layout="horizontal"
                        labelAlign="left"
                        colon={false}
                        labelWrap
                    >
                        <Controller
                            name={FORM_INFO.NAME}
                            control={methods.control}
                            render={({ field }) => (
                                <Form.Item label={"プロジェクト名"}>
                                    <Select 
                                        {...field}
                                        placeholder={"プロジェクト名を選択してください。"}
                                        options={projectNames?.projects?.map(project => ({
                                            label: project.name,
                                            value: project.id
                                        }))}
                                    />
                                </Form.Item>
                            )}
                        />
                        
                        <Input 
                            name={FORM_INFO.KEY}
                            label="プロジェクトデータ名"
                            placeholder={"プロジェクトデータ名を入力してください。"}
                        />
                        <Input 
                            name={FORM_INFO.VALUE}
                            label="設定値"
                            placeholder={"設定値を入力してください。"}
                        />
                        <div className="flex-end mt-12 gap-x-4">
                            <Button
                            type="default"
                            className="min-w-[200px]"
                            onClick={() => methods.reset(defaultValue)}
                            disabled={createLoading || updateLoading}
                            >
                            <span className="font-semibold">リセット</span>
                            </Button>
                            <Button
                            type="primary"
                            htmlType="submit"
                            className="min-w-[200px]"
                            disabled={createLoading || updateLoading}
                            >
                            <span className="font-semibold">{'設定'}</span>
                            </Button>
                        </div>
                    </Form>    
                </FormProvider>
            </Spin>
        </div>
        </Modal>
     );
}
 
export default ProjectDataSettingModal;
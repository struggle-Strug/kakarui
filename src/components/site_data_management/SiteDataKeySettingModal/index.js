import { Input, Select } from "@/components/form";
import { Button } from "@/components/ui";
import { useSiteDataCreate, useSiteDataUpdata } from "@/hooks/query";
import { FORM_INFO, sitedataRegisterSchema } from "@/validations/siteDataRegisterSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Modal, Radio, Spin } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const initValue = {
    area: '',
    visbility: 'public',
    value: '',
    key: '',
    description: ''

}

const SiteDataKeySettingModal = ({open, onClose, data, sitenames}) => {
    
    const isEdit = useMemo(() => {
        if(data) return true
        return false
    }, [data])

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(sitedataRegisterSchema()),
        defaultValues: { ...initValue },
    })

    useEffect(() => {
        if (!open) {
            methods.reset(initValue);  // Reset to initial values when the modal is closed
        }
    }, [open]);
    
    useEffect(() => {
        const defaultValue = data
            ? {
                area: `${data.area}${" "}${data.name}`,
                visbility: data.visbility,
                value: data.value,
                key: data.key,
                description: data.description
            }
            : { ...initValue }
        methods.reset(defaultValue)
    },[data])

    const { doCreateSiteData, isPending: createLoading } = useSiteDataCreate({
        onSuccess: (data) => {
          onClose(data)
        },
    })

    const { doUpdateModule, isPending: updateLoading } = useSiteDataUpdata({
        onSuccess: (module) => {
          onClose(module)
        },
    })

    const onSubmit = useCallback(
        async (values) => {
          if (isEdit) {
            doUpdateModule(values)
            return
          }
          doCreateSiteData(values)
        },
        [doCreateSiteData, isEdit]
    )
    

    return ( 
        <Modal 
            open={open}
            onCancel={() => onClose()}
            title={<h1 className="text-lg font-semibold text-dark-gray-3">サイトデータキー設定</h1>}
            className="rounded-3xl"
            footer={null}
            width={698}
        >
        <p className="px-12 text-lg font-light text-primary">サイトデータキーを設定します。</p>
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
                            name={FORM_INFO.AREA}
                            control={methods.control}
                            render={({ field }) => (
                                <Form.Item label={"サイト名"}>
                                    <Select 
                                        {...field}
                                        placeholder={"サイト名を選択してください。"}
                                        options={sitenames?.map(site => ({
                                            label: `${site.area}${" "}${site.name}`,
                                            value: site.id
                                        }))}
                                    />
                                </Form.Item>
                            )}
                        />
                        
                        <Input 
                            name={FORM_INFO.KEY}
                            label="サイトデータ名"
                            placeholder={"サイトデータ名を入力してください。"}
                        />
                        <Controller
                            name={FORM_INFO.VISIBILITY}
                            control={methods.control}
                            defaultValue={data ? data.visbility : "public"}
                            render={({ field }) => (
                                <Form.Item label={"参照範囲"}>
                                    <Radio.Group 
                                        {...field}
                                        className='flex justify-center items-center gap-8 w-full flex-start'
                                    >
                                        <Radio value={"public"} className='text-sm'>パブリック</Radio>
                                        <Radio value={"organization"}>組織</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            )}
                        />
                        <Input 
                            name={FORM_INFO.VALUE}
                            label="設定値"
                            placeholder={"設定値を入力してください。"}
                        />
                        <Input 
                            name={FORM_INFO.DESCRIPTION}
                            label="説明"
                            placeholder={"説明を入力してください。"}
                        />
                        <div className="flex-end mt-12 gap-x-4">
                            <Button
                            type="default"
                            className="min-w-[200px]"
                            onClick={() => methods.reset(initValue)}
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
 
export default SiteDataKeySettingModal;
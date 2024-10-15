import { Input } from "@/components/form";
import { FORM_INFO, sitedataRegisterSchema } from "@/validations/siteDataRegisterSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Modal, Select } from "antd";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

const initValue = {
    sitename: '',
    sitedataname: '',
    visbility: 'public',
    value: '',
    data: '',
    description: ''

}

const SiteDataKeySettingModal = (open, onClose, data) => {
    const isEdit = useMemo(() => {
        if(data) return true
        return false
    }, [data])

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(sitedataRegisterSchema(isEdit)),
        defaultValues: { ...initValue },
    })

    useEffect(() => {
        const defaultValue = data
            ? {
                sitename: data.sitename,
                sitedataname: data.sitedataname,
                visbility: data.visbility,
                value: data.value,
                data: data.data,
                description: data.description
            }
            : { ...initValue }
        methods.reset(defaultValue)
    },[data])
    return ( 
        <Modal 
            open={open}
            onClose={onClose}
            title={<h1 className="text-lg font-semibold text-dark-gray-3">サイトデータキー設定</h1>}
            className="rounded-3xl"
            footer={null}
            width={698}
        >
        <p className="px-12 text-lg font-light text-primary">サイトデータキーを設定します。</p>
        <div className="p-12 pr-20 font-light">
            <Spin
                // spinning={}
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
                        <Select 
                            name={FORM_INFO.SITEDATANAME}
                            label="サイト名"
                        />
                        <Input 
                            name={FORM_INFO.SITEDATANAME}
                            label="サイトデータ名"
                        />
                        <Radio.Group className='flex justify-center gap-8 w-full pl-36' name={FORM_INFO.VISBILITY} defaultValue={defaultValue.visbility} >
                            <Radio value={"public"} className='text-sm'>パブリック</Radio>
                            <Radio value={"organization"}>組織</Radio>
                        </Radio.Group>
                        <Input 
                            name={FORM_INFO.VALUE}
                            label="設定値"
                        />
                        <Input 
                            name={FORM_INFO.DATA}
                            label="データ"
                        />
                        <Input 
                            name={FORM_INFO.DESCRIPTION}
                            label="説明"
                        />
                        <div className="flex-end mt-12 gap-x-4">
                            <Button
                            type="default"
                            className="min-w-[200px]"
                            onClick={() => onClose()}
                            // disabled={createLoading || updateLoading}
                            >
                            <span className="font-semibold">リセット</span>
                            </Button>
                            <Button
                            type="primary"
                            htmlType="submit"
                            className="min-w-[200px]"
                            // disabled={createLoading || updateLoading}
                            >
                            <span className="font-semibold">{isEdit ? '保存' : '登録'}</span>
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
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Radio } from 'antd';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { Input, InputTextArea } from '@/components/form';
import { Button } from '@/components/ui';
import { FORM_SKILL, skillSchema } from '@/validations/skillShema'; // Ensure correct import
import { useSkillCreate } from '@/hooks/query'
const SkillForm = ({ isEdit, onClose }) => {
    const methods = useForm({
        resolver: yupResolver(skillSchema()), // Ensure schema is instantiated
    });

    const { handleSubmit, control } = methods;

    const { doCreateSkill, isPending: createUrlLoading } = useSkillCreate({
        onSuccess: (module) => {
            onClose(module)
        },
    })
    const onSubmit = (data) => {
        const { name, description, schema, visibility, tag } = data;
        let values = {
            name,
            description,
            schema,
            visibility,
            tag
        }
        console.log(data);
        createSkill(values);
    };
    const createSkill = async (values) => {
        if (isEdit) {
            const sasUrlDetail = await doUpdateModuleUrl(values)
            doUpdateModule(values, sasUrlDetail)
            return
        }
        const data = await doCreateSkill(values)
        console.log(data, 'data')
    }

    return (
        <FormProvider {...methods}>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout="horizontal"
                labelAlign="left"
                colon={false}
                labelWrap
                onFinish={handleSubmit(onSubmit)} // Handle form submission
            >
                <Controller
                    name={FORM_SKILL.NAME} // Ensure this matches your schema
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="スキル名"
                            placeholder=""
                        />
                    )}
                />

                <Controller
                    name={FORM_SKILL.DESCRIPTION} // Ensure this matches your schema
                    control={control}
                    render={({ field }) => (
                        <InputTextArea
                            {...field}
                            label="スキル説明"
                            placeholder=""
                            rows={3}
                        />
                    )}
                />

                <Controller
                    name={FORM_SKILL.SCHEMA} // Ensure this matches your schema
                    control={control}
                    render={({ field }) => (
                        <InputTextArea
                            {...field}
                            label="スキーマ"
                            placeholder=""
                            rows={8}
                        />
                    )}
                />

                <Controller
                    name={FORM_SKILL.VISIBILITY} // Ensure this matches your schema
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="タグ"
                            placeholder=""
                        />
                    )}
                />

                <Controller
                    name={FORM_SKILL.TAG} // Use a name that matches your schema
                    control={control}
                    defaultValue="single" // Set default value if needed
                    render={({ field }) => (
                        <div className='flex items-center'>
                            <label className="block mb-2 text-sm font-medium min-w-[100px]">参照範囲</label>
                            <Radio.Group
                                {...field}
                                className='flex justify-center gap-8 w-full pl-36'
                                onChange={e => field.onChange(e.target.value)} // To update the form state
                            >
                                <Radio value="Public" autoFocus={true} className='text-sm'>
                                    パブリック
                                </Radio>
                                <Radio value="Organization" className='text-sm'>
                                    組織
                                </Radio>
                            </Radio.Group>
                        </div>
                    )}
                />

                <div className="flex-end mt-12 gap-x-4">
                    <Button type="default" className="min-w-[200px]" onClick={onClose}>
                        <span className="font-semibold">リセット</span>
                    </Button>
                    <Button type="primary" htmlType="submit" className="min-w-[200px]">
                        <span className="font-semibold">{isEdit ? ' 設定 ' : ' 作成 '}</span>
                    </Button>
                </div>
            </Form>
        </FormProvider>
    );
};

export default SkillForm;
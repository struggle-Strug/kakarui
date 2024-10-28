import { AddIcon, TrashIcon } from "@/components/icons";
import { SearchBar } from "@/components/layout/dashboard";
import { ProjectDataSettingModal } from "@/components/project_data_management";
import { ColumnSorter, RowContent } from "@/components/table";
import { Button, ButtonIcon, Container, Table } from "@/components/ui";
import { useProjectDataQuery } from "@/hooks/query/projectdata";
import { getSearchOptions } from "@/utils/helper/functions";
import { EditOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";

const ProjectDataManagementContainer = () => {
    const [projectDataKeySettingFormFlag, setProjectDataKeySettingFormFlag] = useState(false)
    const [key, setKey] = useState(null)
    
    const onChangeProjectDataKey = (projectDataKey) => {
        const initKey = projectDataKey ? projectDataKey : null
        setKey(initKey)
        setProjectDataKeySettingFormFlag(true)
    }

    const onClose = () => {
        setProjectDataKeySettingFormFlag(false)
        setKey(null)
    }
    
    const [{ sort, search }] = useQueryStates({
        sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
        search: parseAsString,
    })
    
    const { data, projectNames, filteredData, isLoading, isFetching, refetch } = useProjectDataQuery({ search, sort })
    

    const searchOptions = getSearchOptions(data, ['name', 'key']);

    const columns = [
        {
            title: <ColumnSorter title="プロジェクト名" field="name" />,
            dataIndex: "name",
            className: "min-w-[100px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="プロジェクトデータ名" field="key" />,
            dataIndex: "key",
            className: "min-w-[70px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="設定値" field="value" />,
            dataIndex: "value",
            className: "min-w-[70px]",
            render: (item) => <RowContent item={item.toString()} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="更新者" field="update_user_name" />,
            dataIndex: "update_user_name",
            className: "min-w-[70px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="更新日" field="update_date" />,
            dataIndex: "update_date",
            className: "min-w-[70px]",
            render: (item) => <RowContent item={item.slice(0,10)} className="max-w-[400px]" />,
        },
        {
            title: '操作',
            align: 'center',
            render: (record) => (
              <Space>
                <ButtonIcon icon={<EditOutlined size={32} />} onClick={() => onChangeProjectDataKey(record)} />
                <ButtonIcon
                    icon={<TrashIcon size={32} />}
                    onClick={() => projectDataDeleteModalOpen(record)}
                />
              </Space>
            ),
            className: 'min-w-[50px]',
          },   
    ]

    return (
        <Container title="プロジェクトデータ名管理">
            <div className="flex-between mb-5">
                <div className="w-full">
                    <SearchBar placeholder="プロジェクト名・プロジェクトデータ名"  
                        options={searchOptions}
                    />
                </div>
                <Button
                    icon={<AddIcon size={36} />}
                    type="outline"
                    label="新規プロジェクトデータ登録"
                    onClick={() => onChangeProjectDataKey(null)}
                />
            </div>
            <Table 
                total={filteredData.length}
                loading={isLoading || isFetching}
                columns={columns}
                data={filteredData}
            />
            <ProjectDataSettingModal open={projectDataKeySettingFormFlag} onClose={() => onClose()} onRefresh={refetch} data={key} projectNames={projectNames}/>
        </Container>
    );
}
 
export default ProjectDataManagementContainer;
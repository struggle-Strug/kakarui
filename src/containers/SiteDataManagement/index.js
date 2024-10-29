import { AddIcon } from "@/components/icons";
import { SearchBar } from "@/components/layout/dashboard";
import { SiteDataKeySettingModal } from "@/components/site_data_management";
import { ColumnSorter, RowContent } from "@/components/table";
import { Button, ButtonIcon, Container, Table } from "@/components/ui";
import { useSiteDataQuery } from "@/hooks/query/sitedatakey";
import { getSearchOptions } from "@/utils/helper/functions";
import { EditOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";

const SiteDataManagementContainer = () => {
    const [siteDataKeySettingFormFlag, setSiteDataKeySettingFormFlag] = useState(false)
    const [key, setKey] = useState(null)
    
    const onChangeSiteDataKey = (siteDataKey) => {
        const initKey = siteDataKey ? siteDataKey : null
        setKey(initKey)
        setSiteDataKeySettingFormFlag(true)
    }

    const onClose = () => {
        setSiteDataKeySettingFormFlag(false)
        setKey(null)
    }
    
    const [{ sort, search }] = useQueryStates({
        sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
        search: parseAsString,
    })
    
    const { data, siteNames, filteredData, isLoading, isFetching, refetch } = useSiteDataQuery({ search, sort })

    const searchOptions = getSearchOptions(data, ['area', 'name', 'key']);

    const columns = [
        {
            title: <ColumnSorter title="サイトエリア名" field="area" />,
            dataIndex: "area",
            className: "min-w-[100px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="サイト名" field="name" />,
            dataIndex: "name",
            className: "min-w-[70px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="サイトデータ名" field="key" />,
            dataIndex: "key",
            className: "min-w-[120px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="参照範囲" field="visibility" />,
            dataIndex: "visibility",
            className: "min-w-[70px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="設定値" field="value" />,
            dataIndex: "value",
            className: "min-w-[70px]",
            render: (item) => <RowContent item={JSON.stringify(item)} className="max-w-[400px]" />,
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
                <ButtonIcon icon={<EditOutlined size={32} />} onClick={() => onChangeSiteDataKey(record)} />
              </Space>
            ),
            className: 'min-w-[50px]',
          },   
    ]

    return (
        <Container title="サイトデータ管理">
            <div className="flex-between mb-5">
                <div className="w-full">
                    <SearchBar placeholder="サイトエリア名・サイト名・サイトデータ名"  options={searchOptions}/>
                </div>
                <Button
                    icon={<AddIcon size={36} />}
                    type="outline"
                    label="新規サイトデータ登録"
                    onClick={() => onChangeSiteDataKey(null)}
                />
            </div>
            <Table 
                total={filteredData.length}
                loading={isLoading || isFetching}
                columns={columns}
                data={filteredData}
            />
            <SiteDataKeySettingModal open={siteDataKeySettingFormFlag} onClose={() => onClose()} onRefresh={refetch} data={key} sitenames={siteNames?.sites}/>
        </Container>
    );
}
 
export default SiteDataManagementContainer;
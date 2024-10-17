import { TrashIcon } from "@/components/icons";
import { SearchBar } from "@/components/layout/dashboard";
import { SiteDataKeySettingModal } from "@/components/site_data_management";
import { ColumnSorter } from "@/components/table";
import { Container, Table } from "@/components/ui";
import { useModuleQuery } from "@/hooks/query";
import { useDebouncedCallback } from "@/hooks/share";
import { getSearchOptions } from "@/utils/helper/functions";
import { EditOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";

const SiteDataManagementContainer = () => {
    const [page, setPage] = useState(1)
    const [siteDataKeySettingFormFlag, setSiteDataKeySettingFormFlag] = useState(false)
    const [key, setKey] = useState(null)

    const onChangePage = useDebouncedCallback((newPage) => {
        startClicking(() => {
          setPage(newPage)
        })
    })

    const onChangeSiteDataKey = (siteDataKey) => {
        const initKey = siteDataKey ? siteDataKey : null
        setKey(initKey)
        setSiteDataKeySettingFormFlag(true)
    }

    
    const [{ sort, search }] = useQueryStates({
        sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
        search: parseAsString,
    })
    
    const { data, filteredData, isLoading, isFetching } = useModuleQuery({ search, sort })
    
    const searchOptions = getSearchOptions(data, ['sitearea', 'sitename', 'sitedatakey']);
    
    const columns = [
        {
            title: <ColumnSorter title="サイトエリア名" field="sitearea" />,
            dataIndex: "sitearea",
            className: "min-w-[200px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="サイト名" field="sitearea" />,
            dataIndex: "sitearea",
            className: "min-w-[200px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="サイトデータ名" field="sitearea" />,
            dataIndex: "sitearea",
            className: "min-w-[200px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="参照範囲" field="sitearea" />,
            dataIndex: "sitearea",
            className: "min-w-[200px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="設定値" field="sitearea" />,
            dataIndex: "sitearea",
            className: "min-w-[200px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="更新者" field="sitearea" />,
            dataIndex: "sitearea",
            className: "min-w-[200px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: <ColumnSorter title="更新日" field="sitearea" />,
            dataIndex: "sitearea",
            className: "min-w-[200px]",
            render: (item) => <RowContent item={item} className="max-w-[400px]" />,
        },
        {
            title: '操作',
            align: 'center',
            render: (record) => (
              <Space>
                <ButtonIcon icon={<EditOutlined size={32} />} onChange={() => onChangeSiteDataKey(record)} />
                <ButtonIcon
                  icon={<TrashIcon size={32} />}
                />
              </Space>
            ),
            className: 'min-w-[100px]',
          },   
    ]

    return (
        <Container title="サイトデータ管理">
            <div className="flex-between mb-5">
                <div className="w-full">
                    <SearchBar placeholder="サイトエリア名・サイト名・サイトデータキー"  options={searchOptions}/>
                </div>
                <Table 
                    total={filteredData.length}
                    loading={isLoading || isFetching}
                    columns={columns}
                    data={filteredData}
                />
                <Pagination 
                    defaultCurrent={page}
                    pageSize={10}
                    onChange={onChangePage}
                    showSizeChanger={false}
                    className="header-menu"
                    total={filteredData.length}
                    showLessItems
                />
                <SiteDataKeySettingModal open={siteDataKeySettingFormFlag} onClose={() => setSiteDataKeySettingFormFlag(false)} data={key}/>
            </div>
        </Container>
    );
}
 
export default SiteDataManagementContainer;
/* eslint-disable camelcase */
import { Space } from 'antd'
import { ApartmentOutlined } from '@ant-design/icons';
import noop from 'lodash/noop'

import { Routes } from '@/constants'
import { useGetMe, useUserActive, useProjectActive } from '@/hooks/query'

import { DeployAddEditModal } from '@/components/deployment'
import { SequenceAddEditModal } from '@/components/deployment'
import { DeleteIcon, DeployIcon, EditIcon, } from '@/components/icons'
import { ColumnSorter, RowContent, RowDate, RowTextLink } from '@/components/table'
import { ButtonIcon, Table } from '@/components/ui'

const ModuleConfigTable = ({ data, total, loading }) => {
  const { isSystemAdmin, isOrgAdmin } = useGetMe()
  const { userActiveId } = useUserActive()
  const { projectActiveId } = useProjectActive();
  console.log("data", data);
  
  const columns = [
    {
      title: (
        <div className='pl-4'> {/* Apply padding to the entire div */}
          モジュール配置名
          <br />
          <span className='pl-4'>
            /シーケンス名
          </span>
        </div>
      ),
      dataIndex: 'name',
      className: 'min-w-[164px]',
      render: (item, { id, schema }) => (

        <RowTextLink
          pathname={Routes.MODULE_CONFIG_DETAIL}
          query={{ module_config_id: id }}
          disabled={!id}
        >
          {
            !schema ? <RowContent item={item} /> : <RowContent item={item} className='ml-8' />
          }
        </RowTextLink>
      ),
    },
    {
      title: <ColumnSorter title="説明" field="description" />,
      dataIndex: 'description',
      className: 'min-w-[400px]',
      render: (item) => <RowContent item={item} className="max-w-[500px]" />,
    },
    {
      title: <ColumnSorter title="登録日" field="create_date" />,
      dataIndex: 'create_date',
      className: 'min-w-[164px]',
      render: (item) => <RowDate item={item} />,
    },
    {
      title: <ColumnSorter title="更新者" field="update_user_name" />,
      dataIndex: 'update_user_name',
      className: 'min-w-[164px]',
      render: (item) => <RowContent item={item} />,
    },
    {
      title: <ColumnSorter title="更新日" field="update_date" />,
      dataIndex: 'update_date',
      className: 'min-w-[164px]',
      render: (item) => <RowDate item={item} />,
    },
    {
      title: <span className="text-center">操作</span>,
      dataIndex: 'id',
      align: 'center',
      render: (id, row) => (
        <Space>
          {
            row?.config_data
            ?
            <RowTextLink
              pathname={Routes.MODULE_CONFIG_DETAIL}
              query={{ module_config_id: id }}
              disabled={!id}
            >
              <ButtonIcon icon={<EditIcon size={32} />} onClick={noop} />
            </RowTextLink>
            :
            <RowTextLink
            pathname={Routes.SEQUENCE_EDITOR}
            query={{ module_config_id: id, project_id: projectActiveId, sequence_id: row?.id }}
            disabled={!id}
            >
              <ButtonIcon icon={<EditIcon size={32} />} onClick={noop} />
            </RowTextLink>
          }
          {
            row.schema ? 
              <SequenceAddEditModal isEdit data={row}>
                <ButtonIcon icon={<DeployIcon size={32} />} onClick={noop} />
              </SequenceAddEditModal>
               : 
              <RowTextLink
                pathname={Routes.SEQUENCE_CONFIG_CREATE}
                query={{ module_config_id: id, project_id: projectActiveId }}
                disabled={!id}
              >
                <ApartmentOutlined className='text-[30px]' onClick={noop} />
              </RowTextLink>
          }
          {
            row.schema ? "" : <DeployAddEditModal isEdit data={row}>
              <ButtonIcon icon={<DeployIcon size={32} />} onClick={noop} />
            </DeployAddEditModal>
          }

          <RowTextLink
            pathname={Routes.MODULE_CONFIG_DELETE}
            query={{ module_config_id: id }}
            disabled={!id || (!isSystemAdmin && !isOrgAdmin && row.create_user !== userActiveId)}
          >
            <ButtonIcon
              icon={<DeleteIcon size={32} />}
              onClick={noop}
              disabled={!id || (!isSystemAdmin && !isOrgAdmin && row.create_user !== userActiveId)}
            />
          </RowTextLink>
        </Space>
      ),
      className: 'min-w-[150px]',
    },
  ]

  return <Table total={total} pagination={{}} loading={loading} columns={columns} data={data} />
}

export default ModuleConfigTable

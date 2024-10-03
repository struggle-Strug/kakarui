import { Space } from 'antd'
import noop from 'lodash/noop'

import { EditIcon, TrashIcon } from '@/components/icons'
import { ColumnSorter, RowContent, RowDate } from '@/components/table'
import { ButtonIcon, Table } from '@/components/ui'

import ProjectAddEditModal from '../ProjectAddEditModal'
import ProjectDeleteModal from '../ProjectDeleteModal'

const ProjectTable = ({ data, total, loading, reload }) => {
  const columns = [
    {
      title: <ColumnSorter title="プロジェクト名" field="name" />,
      dataIndex: 'name',
      className: 'min-w-[220px]',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    },
    {
      title: <ColumnSorter title="説明" field="description" />,
      dataIndex: 'description',
      className: 'min-w-[320px]',
      render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    },
    // TODO MVP1.3対応予定
    // {
    //   title: <ColumnSorter title="作成者" field="author" />,
    //   dataIndex: 'create_user',
    //   className: 'min-w-[320px]',
    //   render: (item) => <RowContent item={item} className="max-w-[400px]" />,
    // },
    {
      title: <ColumnSorter title="作成日" field="create_date" />,
      dataIndex: 'create_date',
      render: (item) => <RowDate item={item} className="text-base" />,
    },
    {
      title: <ColumnSorter title="更新日" field="update_date" />,
      dataIndex: 'update_date',
      render: (item) => <RowDate item={item} className="text-base" />,
    },
    {
      title: <span className="text-base">操作</span>,
      render: (record) => (
        <Space>
          <ProjectAddEditModal isEdit data={record} onSuccess={() => reload?.()}>
            <ButtonIcon icon={<EditIcon size={32} />} onClick={noop} />
          </ProjectAddEditModal>
          <ProjectDeleteModal data={record} onSuccess={() => reload?.()}>
            <ButtonIcon onClick={noop} icon={<TrashIcon size={32} />} />
          </ProjectDeleteModal>
        </Space>
      ),
    },
  ]

  return <Table total={total} pagination={{}} loading={loading} columns={columns} data={data} />
}

export default ProjectTable

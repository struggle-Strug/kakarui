import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useUserQuery } from '@/hooks/query'
import { useDebouncedCallback } from '@/hooks/share'

import { Container } from '@/components/ui'
import { UserAddModalButton, UserSearchBox, UserTable } from '@/components/user'

import { getSearchOptions } from '@/utils/helper/functions'

const UserContainer = () => {
  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching, refetch } = useUserQuery({ search, sort })

  const onRefetch = useDebouncedCallback(refetch)

  return (
    <Container title="ユーザ管理">
      <Head>
        <title>ユーザ管理</title>
      </Head>
      <div className="flex-between mb-5">
        <UserSearchBox options={getSearchOptions(data, ['company', 'name', 'mail'])} />
        <UserAddModalButton onSuccess={onRefetch} />
      </div>

      <UserTable
        data={filteredData}
        loading={isLoading || isFetching}
        total={filteredData.length}
        reload={onRefetch}
      />
    </Container>
  )
}

export default UserContainer

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import Head from 'next/head'
import { useEffect, useState } from 'react'

import userApiStub from '@/hooks/stub/user'

import { Container } from '@/components/ui'
import { UserAddModalButton, UserSearchBox, UserTable } from '@/components/user'

import { getSearchOptions } from '@/utils/helper'

const UserContainer = () => {
  const [users, setUsers] = useState([])

  const [query] = useQueryStates({
    filter: parseAsArrayOf(parseAsString, ',').withDefault(['', '']),
    sort: parseAsArrayOf(parseAsString, ',').withDefault(),
    search: parseAsString,
  })

  const { filter, sort, search } = query || {}

  const reload = () => {
    userApiStub.getUsers(filter, sort, search).then(setUsers)
  }

  const onAddUserSuccess = () => {
    reload()
  }

  useEffect(() => {
    reload()
  }, [filter, sort, search])

  return (
    <Container title="ユーザ管理">
      <Head>
        <title>ユーザ管理</title>
      </Head>
      <div className="flex-between mb-5">
        <UserSearchBox options={getSearchOptions(users, ['company', 'name', 'mail'])} />
        <UserAddModalButton onSuccess={onAddUserSuccess} />
      </div>

      <UserTable data={users} loading={false} total={users.length} reload={reload} />
    </Container>
  )
}

export default UserContainer

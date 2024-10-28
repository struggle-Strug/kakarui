import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import { useRouter } from 'next/router'

import { Routes } from '@/constants'
import { useSkillConfigQuery } from '@/hooks/query'
import { SkillAddModal } from '@/components/skill_config'
import { AddIcon } from '@/components/icons'
import { SearchBar } from '@/components/layout/dashboard'
import { SkillConfigTable } from '@/components/skill_config'
import { Button, Container } from '@/components/ui'

import { getSearchOptions } from '@/utils/helper/functions'

const SkillConfigContainer = () => {
  const router = useRouter()

  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  })

  const { data, filteredData, isLoading, isFetching } = useSkillConfigQuery({
    sort,
    search,
  })

  const searchOptions = getSearchOptions(data, ['name'])

  return (
    <Container title="スキル管理">
      <div className="flex-between mb-5">
        <div className="w-full">
          <SearchBar placeholder="スキル名・スキル説明" options={searchOptions} />
        </div>

        <Button
          disabled={false}
          type="outline"
          icon={<AddIcon size={36} />}
          label="スキル紐付け登録"
        />
        <SkillAddModal>
          <Button
            type="outline"
            icon={<AddIcon size={36} />}
            label="新規スキル登録"
            onClick={() => router.push(Routes.MODULE_CONFIG_CREATE)}
          />
        </SkillAddModal>
      </div>

      <SkillConfigTable
        loading={isLoading || isFetching}
        total={filteredData.length}
        data={filteredData}
      />
    </Container>
  )
}

export default SkillConfigContainer

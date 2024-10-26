import React, { useEffect, useState } from 'react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { buildApiURL } from '@/utils/helper/request'

import { Axios } from '@/libs/axios'
import { useRouter } from 'next/router';
import { API, API_ERRORS, MODULE_CONFIG_LIST_KEY } from '@/constants'
import { Routes } from '@/constants';
import { useModuleConfigQuery } from '@/hooks/query';

import { AddIcon } from '@/components/icons';
import { SearchBar } from '@/components/layout/dashboard';
import { ModuleConfigTable } from '@/components/module_config';
import { Button, Container } from '@/components/ui';
import { getSearchOptions } from '@/utils/helper/functions';
import { useOrganizationQuery } from '@/hooks/query/organization/index';
import { useProjectActive } from '@/hooks/query/project/index'
const ModuleConfigContainer = () => {
  const { organizationId } = useOrganizationQuery()
  const { projectActiveId } = useProjectActive()
  const router = useRouter();
  const [resutlData, setResultData] = useState([]);
  const [{ sort, search }] = useQueryStates({
    sort: parseAsArrayOf(parseAsString, ',').withDefault(''),
    search: parseAsString,
  });

  const { data, filteredData, moduleData, isLoading, isFetching } = useModuleConfigQuery({
    sort,
    search,
  });
  const init = async () => {
    let moduleData = [];

    const promises = filteredData.map(async (data) => {
      const response = await Axios.get(
        buildApiURL(API.MODULE_SEQUENCES_CONFIG.LIST, {
          organization_id: organizationId,
          project_id: projectActiveId,
          module_config_id: data.id
        })
      );
      moduleData.push(data);
      response.data.sequences.forEach((sequenceData) => {
        moduleData.push(sequenceData);
      });
    });
    await Promise.all(promises);
    setResultData(moduleData);
  }
  useEffect(() => {
    init();
  }, [filteredData]);
  const searchOptions = getSearchOptions(data, ['name']);
  return (
    <Container title="モジュール配置管理">
      <div className="flex-between mb-5">
        <div className="w-full">
          <SearchBar placeholder="モジュール配置名・説明" options={searchOptions} />
        </div>
        <Button
          type="outline"
          icon={<AddIcon size={36} />}
          label="新規モジュール配置作成"
          onClick={() => router.push(Routes.MODULE_CONFIG_CREATE)}
        />
      </div>

      <ModuleConfigTable
        loading={isLoading || isFetching}
        total={resutlData?.length}
        data={resutlData}
      />
    </Container>
  )
}

export default ModuleConfigContainer

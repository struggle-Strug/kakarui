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
      const sequencesData = [
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "module_config_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "module_config_name": "ModuleConfigA",
          "name": "SequencetA",
          "description": "This is SequenceA.",
          "schema": {
            "root": {
              "BehaviorTree": {
                "ID": "MainTree",
                "Tree": [
                  {
                    "Sequence": [
                      {
                        "karakuri_skill_id": "xxxx-xxxxxxx-xxxxx",
                        "Node": "PREPARE"
                      },
                      {
                        "karakuri_skill_id": "xxxx-xxxxxxx-xxxxx",
                        "Node": "NAVIGATION",
                        "@destination_dataid": {
                          "refer_to": "data",
                          "refer_id": "xxxx-xxxxxx-xxxxx",
                          "value": null
                        },
                        "@destination_value": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": [
                            10,
                            10,
                            10
                          ]
                        },
                        "@frame": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": "map"
                        },
                        "@orientation": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": [
                            0,
                            0,
                            -0.22833,
                            0.97358
                          ]
                        },
                        "@context": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": "move to the kitchen"
                        }
                      },
                      {
                        "karakuri_skill_id": "xxxx-xxxxxxx-xxxxx",
                        "Node": "FIND",
                        "@target_description": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": "juice"
                        },
                        "@context": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": "find the juice on the left"
                        }
                      }
                    ]
                  }
                ]
              }
            }
          },
          "create_user": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          "create_user_name": "create user",
          "create_date": "2024-06-18T12:22:34.024",
          "update_user": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          "update_user_name": "update user",
          "update_date": "2024-06-18T12:22:34.024"
        },
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "module_config_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "module_config_name": "ModuleConfigB",
          "name": "SequencetB",
          "description": "This is SequenceB.",
          "schema": {
            "root": {
              "BehaviorTree": {
                "ID": "MainTree",
                "Tree": [
                  {
                    "Sequence": [
                      {
                        "karakuri_skill_id": "xxxx-xxxxxxx-xxxxx",
                        "Node": "PREPARE"
                      },
                      {
                        "karakuri_skill_id": "xxxx-xxxxxxx-xxxxx",
                        "Node": "NAVIGATION",
                        "@destination_dataid": {
                          "refer_to": "data",
                          "refer_id": "xxxx-xxxxxx-xxxxx",
                          "value": null
                        },
                        "@destination_value": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": [
                            10,
                            10,
                            10
                          ]
                        },
                        "@frame": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": "map"
                        },
                        "@orientation": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": [
                            0,
                            0,
                            -0.22833,
                            0.97358
                          ]
                        },
                        "@context": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": "move to the kitchen"
                        }
                      },
                      {
                        "karakuri_skill_id": "xxxx-xxxxxxx-xxxxx",
                        "Node": "FIND",
                        "@target_description": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": "juice"
                        },
                        "@context": {
                          "refer_to": null,
                          "refer_id": null,
                          "value": "find the juice on the left"
                        }
                      }
                    ]
                  }
                ]
              }
            }
          },
          "create_user": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          "create_user_name": "create user",
          "create_date": "2024-06-18T12:22:34.024",
          "update_user": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          "update_user_name": "update user",
          "update_date": "2024-06-18T12:22:34.024"
        }
      ];
      sequencesData.forEach((sequenceData) => {
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

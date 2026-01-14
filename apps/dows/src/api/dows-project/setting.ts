import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';
import { transformTableResponse } from '#/utils/api-helper';

export namespace ProjectSettingApi {
  export interface ProjectSetting {
    [key: string]: any;
    projectSettingId: string;
    /** 设置key */
    settingKey: string;
    /** 设置详情 */
    settingJson: string;
    projectInstanceId?: string;
    id?: string;
  }

  // Add the delete item interface
  export interface DeleteProjectSettingItem {
    projectSettingId: string;
  }
}

/**
 * 获取项目设置列表数据
 */
async function getProjectSettingList(params: Recordable<any> = {}) {
  const response = await requestClient.get<any>('/admin/project/setting/page', {
    params,
  });

  const finalRes = transformTableResponse(response);

  if (finalRes.items) {
    finalRes.items = finalRes.items.map((item) => ({
      ...item,
      id: item.id || item.projectSettingId,
    }));
  }

  return finalRes;
}

/**
 * 创建项目设置
 * @param data 项目设置数据
 */
async function createProjectSetting(
  data: Omit<ProjectSettingApi.ProjectSetting, 'projectSettingId'>, // 排除 projectSettingId 字段
) {
  const reqData = [data];
  return requestClient.post('/admin/project/setting/entity', reqData);
}

/**
 * 更新项目设置
 *
 * @param projectSettingId 项目设置 ID
 * @param data 项目设置数据
 */
async function updateProjectSetting(
  projectSettingId: string,
  data: Omit<ProjectSettingApi.ProjectSetting, 'projectSettingId'>,
) {
  const reqData = [{ ...data, projectSettingId }];
  return requestClient.put('/admin/project/setting/entity', reqData);
}

/**
 * 单个删除项目设置
 * @param projectSettingId 项目设置 ID
 */
async function deleteProjectSetting(projectSettingId: string) {
  return batchDeleteProjectSetting([{ projectSettingId }]);
}

/**
 * 批量删除项目设置 传入多个id对象的数组，页面传来的是单个，要转成id对象的数组，接口实际接收如 [{keyId1:keyId1Value}, {keyId2:keyId2Value}...]
 * @param reqData 项目设置删除请求数据数组
 */
async function batchDeleteProjectSetting(
  reqData: ProjectSettingApi.DeleteProjectSettingItem[],
) {
  return requestClient.delete('/admin/project/setting/entity', { data: reqData });
}

export {
  createProjectSetting,
  deleteProjectSetting,
  getProjectSettingList,
  updateProjectSetting,
};
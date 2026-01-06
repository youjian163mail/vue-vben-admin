import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';
import { transformTableResponse } from '#/utils/api-helper';

export namespace ProjectTagApi {
  export interface ProjectTag {
    [key: string]: any;
    projectTagId: string;
    tagName: string;
    tagColor: string;
    projectInstanceId?: string;
    id?: string;
  }

  // Add the delete item interface
  export interface DeleteProjectTagItem {
    projectTagId: string;
  }
}

/**
 * 获取项目标签列表数据
 */
async function getProjectTagList(params: Recordable<any> = {}) {
  const response = await requestClient.get<any>('/admin/project/tag/page', {
    params,
  });

  const finalRes = transformTableResponse(response);

  if (finalRes.items) {
    finalRes.items = finalRes.items.map((item) => ({
      ...item,
      projectTagId: item.projectTagId || item.id,
    }));
  }

  return finalRes;
}

/**
 * 创建项目标签
 * @param data 项目标签数据
 */
async function createProjectTag(
  data: Omit<ProjectTagApi.ProjectTag, 'projectTagId'>, // 排除 projectTagId 字段
) {
  const reqData = [data];
  return requestClient.post('/admin/project/tag/entity', reqData);
}

/**
 * 更新项目标签
 *
 * @param projectTagId 项目标签 ID
 * @param data 项目标签数据
 */
async function updateProjectTag(
  projectTagId: string,
  data: Omit<ProjectTagApi.ProjectTag, 'projectTagId'>,
) {
  const reqData = [{ ...data, projectTagId }];
  return requestClient.put('/admin/project/tag/entity', reqData);
}

/**
 * 单个删除项目标签
 * @param projectTagId 项目标签 ID
 */
async function deleteProjectTag(projectTagId: string) {
  return batchDeleteProjectTag([{ projectTagId }]);
}

/**
 * 批量删除项目标签 传入多个id对象的数组，页面传来的是单个，要转成id对象的数组，接口实际接收如 [{keyId1:keyId1Value}, {keyId2:keyId2Value}...]
 * @param reqData 项目标签删除请求数据数组
 */
async function batchDeleteProjectTag(
  reqData: ProjectTagApi.DeleteProjectTagItem[],
) {
  return requestClient.delete('/admin/project/tag/entity', { data: reqData });
}

export {
  createProjectTag,
  deleteProjectTag,
  getProjectTagList,
  updateProjectTag,
};

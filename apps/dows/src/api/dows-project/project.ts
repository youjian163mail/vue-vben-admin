import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';
import { transformTableResponse } from '#/utils/api-helper';

export namespace ProjectApi {
  export interface Project {
    [key: string]: any;
    projectInstanceId: string;
    projectName: string;
    projectCode: string;
    description?: string;
    progress?: number;
    id?: string;
    projectMemberNum?: number;
    mindUrl?: string;
    startTime?: string;
    endTime?: string;
    scope?: string;
    icon?: string;
  }

  // Add the delete item interface
  export interface DeleteProjectItem {
    projectInstanceId: string;
  }
}

/**
 * 获取项目列表数据
 */
async function getProjectList(params: Recordable<any> = {}) {
  const response = await requestClient.get<any>('/admin/project/page', {
    params,
  });

  const finalRes = transformTableResponse(response);

  if (finalRes.items) {
    finalRes.items = finalRes.items.map((item) => ({
      ...item,
      id: item.id || item.projectInstanceId,
      projectMemberNum: 20, // 添加项目成员数量字段，固定值为20
      progress: item.progress === null ? 0 : item.progress, // 设置progress字段，如果不存在则默认为0
      mindUrl: 'https://example.com/mindmap', // 脑图链接，先固定值
    }));
  }

  return finalRes;
}

/**
 * 创建项目
 * @param data 项目数据
 */
async function createProject(
  data: Omit<ProjectApi.Project, 'projectInstanceId'>, // 排除 projectInstanceId 字段
) {
  const reqData = [data];
  return requestClient.post('/admin/project/entity', reqData);
}

/**
 * 更新项目
 *
 * @param data 项目数据
 */
async function updateProject(
  projectInstanceId: string,
  data: Omit<ProjectApi.Project, 'projectInstanceId'>,
) {
  const reqData = [{ ...data, projectInstanceId }];
  return requestClient.put('/admin/project/entity', reqData);
}

/**
 * 单个删除项目
 * @param projectInstanceId 项目 ID
 */
async function deleteProject(projectInstanceId: string) {
  return batchDeleteProject([{ projectInstanceId }]);
}

/**
 * 批量删除项目 传入多个id对象的数组，页面传来的是单个，要转成id对象的数组，接口实际接收如 [{keyId1:keyId1Value}, {keyId2:keyId2Value}...]
 * @param ProjectApi.DeleteProjectItem[]
 */
async function batchDeleteProject(reqData: ProjectApi.DeleteProjectItem[]) {
  return requestClient.delete(`/admin/project/entity`, { data: reqData });
}

export { createProject, deleteProject, getProjectList, updateProject };

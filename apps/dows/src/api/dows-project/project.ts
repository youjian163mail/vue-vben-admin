import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace ProjectApi {
  export interface Project {
    [key: string]: any;
    projectInstanceId: string;
    projectName: string;
    description?: string;
  }
}

/**
 * 获取项目列表数据
 */
async function getProjectList(_params: Recordable<any> = {}) {
  const response = await requestClient.get<any>('/admin/project/page', {
    params: _params,
  });

  // 直接返回整个响应，让调用方处理格式
  response.items = response.records;
  response.total = response.totalRow;
  return response;
}

/**
 * 创建项目
 * @param data 项目数据
 */
async function createProject(
  data: Omit<ProjectApi.Project, 'projectInstanceId'>,
) {
  const reqData = [data];
  return requestClient.post('/admin/project/entity', reqData);
}

/**
 * 更新项目
 *
 * @param projectInstanceId 项目 ID
 * @param data 项目数据
 */
async function updateProject(
  projectInstanceId: string,
  data: Omit<ProjectApi.Project, 'projectInstanceId'>,
) {
  return requestClient.put(`/admin/project/entity/${projectInstanceId}`, data);
}

/**
 * 删除项目
 * @param projectInstanceId 项目 ID
 */
async function deleteProject(projectInstanceId: string) {
  return requestClient.delete(`/admin/project/entity/${projectInstanceId}`);
}

export { createProject, deleteProject, getProjectList, updateProject };

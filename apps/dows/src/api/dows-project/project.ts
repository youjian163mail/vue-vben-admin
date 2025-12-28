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
async function getProjectList(params: Recordable<any>) {
  return requestClient.get<Array<ProjectApi.Project>>('/admin/project/page', {
    params,
  });
}

/**
 * 创建项目
 * @param data 项目数据
 */
async function createProject(
  data: Omit<ProjectApi.Project, 'projectInstanceId'>,
) {
  return requestClient.post('/admin/project/entity', data);
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

import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';
import { transformTableResponse } from '#/utils/api-helper';

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
async function getProjectList(params: Recordable<any> = {}) {
  const response = await requestClient.get<any>('/admin/project/page', {
    params,
  });

  const finalRes = transformTableResponse(response);

  if (finalRes.items) {
    finalRes.items = finalRes.items.map((item) => ({
      ...item,
      projectMemberNum: 20, // 添加项目成员数量字段，固定值为20
      progress: '已完成', // 项目进度，先固定值为100
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

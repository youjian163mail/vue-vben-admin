import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProjectApi } from '#/api/dows-project/project';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'projectName',
      label: $t('dows-project.project.projectName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'projectCode',
      label: $t('dows-project.project.projectCode'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: $t('dows-project.project.description'),
    },
  ];
}

// grid 搜索表单
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'projectName',
      label: $t('dows-project.project.projectName'),
    },
    {
      component: 'Input',
      fieldName: 'projectCode',
      label: $t('dows-project.project.projectCode'),
    },
  ];
}

// grid 列
export function useColumns<T = ProjectApi.Project>(
  _onActionClick: OnActionClickFn<T>,
  _onStatusChange?: (
    newStatus: any,
    row: T,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'projectName', // Changed to project-specific field
      title: $t('dows-project.project.projectName'), // Fixed translation key
      width: 400,
    },
    {
      field: 'projectCode',
      title: $t('dows-project.project.projectCode'), // Fixed translation key
      width: 200,
    },
    {
      field: 'description', // Changed to project-specific field
      minWidth: 400,
      title: $t('dows-project.project.description'), // Fixed translation key
    },
  ];
}

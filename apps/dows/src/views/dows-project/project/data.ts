import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProjectApi } from '#/api/dows-project/project';

import dayjs from 'dayjs';

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
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'projectName',
      title: $t('dows-project.project.projectName'),
      width: 300,
    },
    {
      align: 'center',
      field: 'projectMemberNum',
      title: $t('dows-project.project.projectMemberNum'),
      width: 100,
    },
    {
      align: 'center',
      field: 'progress',
      title: $t('dows-project.project.progress'),
      width: 100,
    },
    {
      align: 'center',
      field: 'mindUrl',
      title: $t('dows-project.project.mindUrl'),
      width: 400,
    },
    {
      align: 'center',
      field: 'startTime',
      title: $t('dows-project.project.startTime'),
      width: 600,
      formatter: ({ cellValue }) => {
        return cellValue ? dayjs(cellValue).format('YYYY/MM/DD') : '';
      },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'projectName',
          nameTitle: $t('dows-project.project.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('dows-project.project.operation'),
      width: 130,
    },
  ];
}

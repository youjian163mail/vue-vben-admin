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
      component: 'Textarea',
      fieldName: 'description',
      label: $t('dows-project.project.description'),
    },
  ];
}

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

export function useColumns<T = ProjectApi.Project>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: $t('system.role.roleName'),
      width: 200,
    },
    {
      field: 'id',
      title: $t('system.role.id'),
      width: 200,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('system.role.status'),
      width: 100,
    },
    {
      field: 'remark',
      minWidth: 100,
      title: $t('system.role.remark'),
    },
    {
      field: 'createTime',
      title: $t('system.role.createTime'),
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 130,
    },
  ];
}

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProjectApi } from '#/api/dows-project/project';

import dayjs from 'dayjs';

import { $t } from '#/locales';

const SCOPE_OPTIONS = [
  {
    label: '成员可见',
    value: '0',
  },
  {
    label: '组织可见',
    value: '1',
  },
];

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
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: SCOPE_OPTIONS,
        placeholder: '请选择',
        showSearch: false,
        style: { width: '200px' }, // 增加下拉框宽度
      },
      fieldName: 'scope',
      label: $t('dows-project.project.scope'),
    },
    {
      component: 'IconPicker',
      fieldName: 'icon',
      label: '图标',
    },
    {
      component: 'DatePicker',
      fieldName: 'startTime',
      label: $t('dows-project.project.startTime'),
      componentProps: {
        valueFormat: 'YYYY-MM-DDT00:00:00', // 设置日期格式
        style: { width: '200px' }, // 设置日期选择器宽度与下拉框一致
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'endTime',
      label: $t('dows-project.project.endTime'),
      componentProps: {
        valueFormat: 'YYYY-MM-DDT23:59:59', // 设置日期格式
        style: { width: '200px' }, // 设置日期选择器宽度与下拉框一致
      },
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: $t('dows-project.project.description'),
      componentProps: {
        rows: 8, // 设置文本域高度为8行
      },
    },
  ];
}

// grid 搜索表单
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('dows-project.project.projectName'),
    },
    {
      component: 'DatePicker',
      fieldName: 'startTime',
      label: $t('dows-project.project.startTime'),
    },
  ];
}

// grid 列
export function useColumns<T = ProjectApi.Project>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      align: 'left',
      field: 'projectName',
      title: $t('dows-project.project.projectName'),
      width: 530,
      className: 'pl-4', // 内容单元格添加左侧内边距
    },
    {
      align: 'left',
      field: 'projectMemberNum',
      title: $t('dows-project.project.projectMemberNum'),
      width: 100,
      sortable: true,
    },
    {
      align: 'center',
      field: 'progress',
      title: $t('dows-project.project.progress'),
      width: 150,
      slots: { default: 'progress' },
    },
    {
      align: 'left',
      field: 'mindUrl',
      title: $t('dows-project.project.mindUrl'),
      width: 600,
    },
    {
      align: 'center',
      field: 'startTime',
      title: $t('dows-project.project.startTime'),
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? dayjs(cellValue).format('YYYY/MM/DD') : '';
      },
    },
    {
      align: 'left',
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

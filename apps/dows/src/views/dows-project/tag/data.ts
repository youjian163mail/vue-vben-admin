import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProjectTagApi } from '#/api/dows-project/tag';

import { $t } from '#/locales';

// 表单模式
type _FormMode = 'create' | 'edit' | 'view';

// grid 搜索表单
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'tagName',
      label: $t('dows-project.tag.tagName'),
    },
  ];
}

// grid 列
export function useColumns<T = ProjectTagApi.ProjectTag>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      title: '序号',
      width: 60,
      align: 'center',
    },
    {
      align: 'center',
      field: 'tagName',
      title: $t('dows-project.tag.tagName'),
      width: 350,
    },
    {
      align: 'center',
      field: 'tagColor',
      title: $t('dows-project.tag.tagColor'),
      width: 150,
    },
    {
      align: 'right', // 修改为右对齐
      cellRender: {
        attrs: {
          codeField: 'code',
          nameField: 'tagName',
          nameTitle: $t('dows-project.tag.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { label: $t('ui.actionTitle.edit'), code: 'edit', type: 'link' },
          { label: $t('ui.actionTitle.delete'), code: 'delete', type: 'link' },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('dows-project.tag.operation'),
      width: 130,
    },
  ];
}

// 表单模式下的表单配置
function useBaseFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'tagName',
      label: $t('dows-project.tag.tagName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'tagColor',
      label: $t('dows-project.tag.tagColor'),
    },
  ];
}

// 创建和编辑模式下的表单配置
export function useFormSchema(): VbenFormSchema[] {
  return [...useBaseFormSchema()];
}

// 查看模式下的表单配置
export function useViewFormSchema(): VbenFormSchema[] {
  return [...useBaseFormSchema()];
}

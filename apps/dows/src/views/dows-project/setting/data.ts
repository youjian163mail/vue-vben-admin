import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProjectSettingApi } from '#/api/dows-project/setting';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'settingKey',
      label: $t('dows-project.setting.settingKey'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 6,
      },
      fieldName: 'settingJson',
      label: $t('dows-project.setting.settingJson'),
    },
  ];
}

export function useViewFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'settingKey',
      label: $t('dows-project.setting.settingKey'),
      componentProps: {
        bordered: false,
        readonly: true,
        style: { border: 'none', boxShadow: 'none', padding: 0 },
      },
    },
    {
      component: 'Input',
      componentProps: {
        bordered: false,
        readonly: true,
        style: { border: 'none', boxShadow: 'none', padding: 0 },
        type: 'textarea',
        rows: 6,
      },
      fieldName: 'settingJson',
      label: $t('dows-project.setting.settingJson'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'settingKey',
      label: $t('dows-project.setting.settingKey'),
    },
  ];
}

export function useColumns<T = ProjectSettingApi.ProjectSetting>(
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
      field: 'settingKey',
      title: $t('dows-project.setting.settingKey'),
      width: 250,
    },
    {
      field: 'settingJson',
      title: $t('dows-project.setting.settingJson'),
      width: 350,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'settingKey',
          nameTitle: $t('dows-project.setting.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('dows-project.setting.operation'),
      width: 130,
    },
  ];
}

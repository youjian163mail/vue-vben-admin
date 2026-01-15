import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProjectSettingApi } from '#/api/dows-project/setting';

import { markRaw } from 'vue';

import { $t } from '#/locales';
import ReadOnlyInputAsLabel from '#/views/common-components/ReadOnlyInputAsLabel.vue';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'settingKey',
      label: $t('dows-project.setting.settingKey'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      componentProps: {
        rows: 28,
      },
      fieldName: 'settingJson',
      label: $t('dows-project.setting.settingJson'),
      wrapperClass: 'flex flex-col items-start',
    },
  ];
}

export function useViewFormSchema(): VbenFormSchema[] {
  return [
    {
      component: markRaw(ReadOnlyInputAsLabel),
      fieldName: 'settingKey',
      label: $t('dows-project.setting.settingKey'),
      componentProps: {
        class: 'read-only-setting-key-input',
      },
    },
    {
      component: markRaw(ReadOnlyInputAsLabel),
      fieldName: 'settingJson',
      label: $t('dows-project.setting.settingJson'),
      wrapperClass: 'flex flex-col items-start gap-0',
      componentProps: {
        class: 'read-only-setting-json-input',
        topAligned: true,
      },
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
      width: 300,
    },
    {
      field: 'settingJson',
      title: $t('dows-project.setting.settingJson'),
      width: 290,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'settingKey',
          nameTitle: $t('dows-project.setting.name'),
          onClick: onActionClick,
        },
        options: [
          {
            text: $t('ui.actionTitle.view'),
            code: 'view',
            type: 'link',
          },
          'edit',
          'delete',
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('dows-project.setting.operation'),
      width: 150,
    },
  ];
}

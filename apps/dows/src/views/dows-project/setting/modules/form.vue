<script lang="ts" setup>
import type { ProjectSettingApi } from '#/api/dows-project/setting';

import { computed, nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  createProjectSetting,
  updateProjectSetting,
} from '#/api/dows-project/setting';
import { $t } from '#/locales';

import { useFormSchema, useViewFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<ProjectSettingApi.ProjectSetting>();
const mode = ref<'create' | 'edit' | 'view'>('create');

const schema = computed(() => {
  return mode.value === 'view' ? useViewFormSchema() : useFormSchema();
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: 'items-start',
  },
  schema: schema.value,
  showDefaultActions: false,
});

// Watch mode changes to update form schema
watch(
  () => mode.value,
  async () => {
    if (formApi) {
      await nextTick();
      formApi.setState({ schema: schema.value });
    }
  },
  { immediate: true },
);

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    if (mode.value === 'view') {
      drawerApi.close();
      return;
    }

    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value
      ? updateProjectSetting(id.value, {
          ...values,
        })
      : createProjectSetting({
          ...values,
          projectInstanceId: formData.value?.projectInstanceId,
        })
    )
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<
        ProjectSettingApi.ProjectSetting & { mode?: string }
      >();
      formApi.resetForm();

      if (data) {
        formData.value = data;
        id.value = data.projectSettingId;
        mode.value =
          (data.mode as any) || (data.projectSettingId ? 'edit' : 'create');
      } else {
        id.value = undefined;
        mode.value = 'create';
      }

      // Update form schema based on mode and wait for it to be applied
      formApi.setState({ schema: schema.value });
      await nextTick();
      await nextTick(); // Double nextTick to ensure DOM updates

      // 根据模式设置取消按钮的显示状态 - 提前处理
      const shouldShowCancel = mode.value !== 'view';
      drawerApi.setState({
        showCancelButton: shouldShowCancel,
        confirmText:
          mode.value === 'view' ? $t('btn-common.close') : $t('common.confirm'),
      });

      if (data) {
        // Transform data based on mode
        let transformedData = { ...data };

        if (mode.value === 'view') {
          // For view mode: transform to display label text if needed
          transformedData = {
            ...transformedData,
          };
        }
        formApi.setValues(transformedData);
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  if (mode.value === 'view') {
    return $t('ui.actionTitle.view', $t('dows-project.setting.name'));
  }
  return formData.value?.projectSettingId
    ? $t('ui.actionTitle.edit', $t('dows-project.setting.name'))
    : $t('ui.actionTitle.create', $t('dows-project.setting.name'));
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>

<script lang="ts" setup>
import type { ProjectApi } from '#/api/dows-project/project';

import { computed, nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createProject, updateProject } from '#/api/dows-project/project';
import { $t } from '#/locales';

import { useFormSchema, useViewFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<ProjectApi.Project>();
const mode = ref<'create' | 'edit' | 'view'>('create');

const schema = computed(() => {
  return mode.value === 'view' ? useViewFormSchema() : useFormSchema();
});

const [Form, formApi] = useVbenForm({
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
    (id.value ? updateProject(id.value, values) : createProject(values))
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
      const data = drawerApi.getData<ProjectApi.Project & { mode?: string }>();
      formApi.resetForm();

      if (data) {
        formData.value = data;
        id.value = data.id;
        mode.value = (data.mode as any) || (data.id ? 'edit' : 'create');
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
        let transformedData = data;
        transformedData.scope = data.scope === null ? '' : String(data.scope);
        if (mode.value === 'view') {
          // For view mode: transform to display label text
          transformedData = {
            ...data,
            scope: getScopeLabel(data.scope),
          };
        }
        formApi.setValues(transformedData);
      } else {
        // 对于创建模式，设置默认值
        formApi.setValues({
          scope: '', // 设置默认的scope为空字符串
        });
      }
    }
  },
});

function getScopeLabel(scopeValue: null | number | string | undefined) {
  if (scopeValue === null || scopeValue === undefined) {
    return '';
  }
  const normalizedValue = String(scopeValue);
  switch (normalizedValue) {
    case '': {
      return '请选择';
    }
    case '0': {
      return '成员可见';
    }
    case '1': {
      return '组织可见';
    }
    default: {
      return String(scopeValue);
    }
  }
}

const getDrawerTitle = computed(() => {
  if (mode.value === 'view') {
    return $t('ui.actionTitle.view', $t('dows-project.project.name'));
  }
  return formData.value?.id
    ? $t('ui.actionTitle.edit', $t('dows-project.project.name'))
    : $t('ui.actionTitle.create', $t('dows-project.project.name'));
});
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
<style lang="css" scoped>
:deep(.ant-tree-title) {
  .tree-actions {
    display: none;
    margin-left: 20px;
  }
}

:deep(.ant-tree-title:hover) {
  .tree-actions {
    display: flex;
    flex: auto;
    justify-content: flex-end;
    margin-left: 20px;
  }
}
</style>

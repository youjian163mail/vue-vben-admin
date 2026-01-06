<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { ProjectTagApi } from '#/api/dows-project/tag';

import { computed, nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createProjectTag, updateProjectTag } from '#/api/dows-project/tag';
import { getMenuList } from '#/api/system/menu';
import { $t } from '#/locales';

import { useFormSchema, useViewFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<ProjectTagApi.ProjectTag>();
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

const permissions = ref<DataNode[]>([]);
const loadingPermissions = ref(false);

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
    (id.value ? updateProjectTag(id.value, values) : createProjectTag(values))
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
        ProjectTagApi.ProjectTag & { mode?: string }
      >();
      formApi.resetForm();

      if (data) {
        formData.value = data;
        id.value = data.projectTagId;
        mode.value =
          (data.mode as any) || (data.projectTagId ? 'edit' : 'create');
      } else {
        id.value = undefined;
        mode.value = 'create';
      }

      if (permissions.value.length === 0) {
        await loadPermissions();
      }

      // Update form schema based on mode and wait for it to be applied
      formApi.setState({ schema: schema.value });
      await nextTick();
      await nextTick(); // Double nextTick to ensure DOM updates

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

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getMenuList();
    permissions.value = res as unknown as DataNode[];
  } finally {
    loadingPermissions.value = false;
  }
}

const getDrawerTitle = computed(() => {
  if (mode.value === 'view') {
    return $t('ui.actionTitle.view', $t('dows-project.tag.name'));
  }
  return formData.value?.projectTagId
    ? $t('ui.actionTitle.edit', $t('dows-project.tag.name'))
    : $t('ui.actionTitle.create', $t('dows-project.tag.name'));
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

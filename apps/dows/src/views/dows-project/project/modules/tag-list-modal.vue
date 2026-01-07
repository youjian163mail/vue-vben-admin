<script setup lang="ts">
import type { ProjectApi } from '#/api/dows-project/project';

import { computed } from 'vue';

import { Modal } from 'ant-design-vue';

import { $t } from '#/locales';

import TagList from '../../../dows-project/tag/list.vue';

interface Props {
  project?: ProjectApi.Project;
  visible?: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  project: undefined,
  visible: false,
});

const emit = defineEmits<Emits>();

const internalVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

function handleOk() {
  emit('ok');
  internalVisible.value = false;
}

function handleCancel() {
  emit('cancel');
  internalVisible.value = false;
}
</script>

<template>
  <Modal
    v-model:open="internalVisible"
    :title="$t('dows-project.tag.tagManagement')"
    width="1200px"
    :bodyStyle="{ maxHeight: '70vh', overflow: 'auto' }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <TagList :project="project" />
  </Modal>
</template>

<style scoped>
:deep(.ant-modal) {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: calc(100vh - 40px); /* 减去一些边距 */
}

:deep(.ant-modal-content) {
  max-height: calc(100vh - 40px);
}
</style>
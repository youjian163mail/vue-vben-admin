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
    width="800px"
    :body-style="{
      height: '70vh',
      display: 'flex',
      flexDirection: 'column'
    }"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="tag-list-container" style="flex: 1; overflow: auto;">
      <TagList :project="project" />
    </div>
  </Modal>
</template>

<style scoped>
/* 保持容器内容在底部 */
.tag-list-container {
  min-height: 0; /* 解决flex子项overflow失效问题 */
}
</style>

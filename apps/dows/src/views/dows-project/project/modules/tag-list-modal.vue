<script lang="ts" setup>
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
</script>

<template>
  <Modal
    v-model:open="internalVisible"
    :title="$t('dows-project.tag.tagManagement')"
    width="900px"
    :body-style="{
      height: '72vh',
      display: 'flex',
      flexDirection: 'column',
    }"
    centered
    :footer="null"
  >
    <div
      class="tag-list-container"
      style="display: flex; flex: 1; flex-direction: column; overflow: hidden"
    >
      <div style="flex: 1; overflow: auto; min-height: 0">
        <TagList :project="project" style="height: 100%" />
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* 保持容器内容在底部 */
.tag-list-container {
  min-height: 0; /* 解决flex子项overflow失效问题 */
}
</style>

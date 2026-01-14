<script lang="ts" setup>
import type { ProjectApi } from '#/api/dows-project/project';

import { computed } from 'vue';

import { Modal } from 'ant-design-vue';

import { $t } from '#/locales';

import SettingList from '../../../dows-project/setting/list.vue';

/**
 * 定义组件接收的 props
 * 注意：使用 v-model:visible 时，必须定义 visible 属性
 */
interface Props {
  project?: ProjectApi.Project;
  visible?: boolean;
}

/**
 * 定义组件触发的事件
 * 实现 v-model 机制，需要发送 update:visible 事件
 */
interface Emits {
  (e: 'update:visible', value: boolean): void;
}

// 定义组件接收的 props，默认值设置
// 必须确保属性名与接口定义完全一致，遵循Vue组件Props命名一致性规范
const props = withDefaults(defineProps<Props>(), {
  project: undefined, // 传递给模态框的项目信息，用于在设置列表中过滤显示该项目的设置
  visible: false, // 控制模态框显示/隐藏的状态
});

// 定义组件触发的事件，用于实现v-model机制
// 通过emit函数可以触发自定义事件，通知父组件值的变化
const emit = defineEmits<Emits>();

/**
 * 创建计算属性实现双向绑定
 * getter 返回从父组件传入的 visible 值
 * setter 触发 update:visible 事件通知父组件值发生变化
 */
const internalVisible = computed({
  get: () => props.visible, // 返回传入的 visible 值
  set: (value) => emit('update:visible', value), // 发出更新事件
});
</script>

<template>
  <Modal
    v-model:open="internalVisible"
    :title="$t('dows-project.setting.management')"
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
      class="setting-list-container"
      style="display: flex; flex: 1; flex-direction: column; overflow: hidden"
    >
      <div style="flex: 1; min-height: 0; overflow: auto">
        <SettingList :project="project" style="height: 100%" />
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* 保持容器内容在底部 */
.setting-list-container {
  min-height: 0; /* 解决flex子项overflow失效问题 */
}
</style>

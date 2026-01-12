<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
});

// 显示modelValue的值，如果没有则显示空字符串
const displayValue = computed(() => props.modelValue || '');
</script>

<template>
  <div class="read-only-input-as-label">
    {{ displayValue }}
  </div>
</template>

<style scoped>
.read-only-input-as-label {
  display: inline-block;
  padding: 0;
  font-size: 14px;
  color: rgb(0 0 0 / 88%);
}
</style>

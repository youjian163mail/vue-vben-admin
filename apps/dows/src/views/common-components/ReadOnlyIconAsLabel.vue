<script setup lang="ts">
import { IconifyIcon } from '@vben/icons';

interface Props {
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
});
</script>

<template>
  <div class="flex items-center">
    <IconifyIcon
      v-if="props.modelValue"
      :icon="props.modelValue"
      class="h-4 w-4"
      width="16"
      height="16"
    />
    <span v-else></span>
  </div>
</template>

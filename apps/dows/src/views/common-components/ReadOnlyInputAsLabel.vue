<script setup lang="ts">
import { computed } from 'vue';

import { formatDate } from '@vben/utils';

/**
 * 只读输入框组件，用于在表单只读模式下显示纯文本内容
 * 特别处理多行文本，保留换行格式
 */
interface Props {
  modelValue?: string;
  formatType?: 'date' | 'datetime' | 'text' | 'time'; // 格式化类型，新增time类型
  dateFormat?: string; // 自定义日期格式
  timeFormat?: string; // 自定义时间格式
  dateTimeFormat?: string; // 自定义日期时间格式
  formatter?: (value: string) => string; // 自定义格式化函数
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  formatType: 'text',
  dateFormat: 'YYYY-MM-DD', // 默认日期格式
  timeFormat: 'HH:mm:ss', // 默认时间格式
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss', // 默认日期时间格式
  formatter: undefined,
});

// 根据formatType对值进行格式化
const displayValue = computed(() => {
  // 如果提供了自定义格式化函数，优先使用它
  if (props.formatter && typeof props.formatter === 'function') {
    return props.formatter(props.modelValue || '');
  }

  const value = props.modelValue || '';

  switch (props.formatType) {
    case 'date': {
      // 如果是日期类型，使用formatDate函数格式化
      if (value && !Number.isNaN(Date.parse(value))) {
        return formatDate(new Date(value), props.dateFormat);
      }
      return value;
    }
    case 'datetime': {
      // 如果是日期时间类型，使用formatDate函数格式化
      if (value && !Number.isNaN(Date.parse(value))) {
        return formatDate(new Date(value), props.dateTimeFormat);
      }
      return value;
    }
    case 'time': {
      // 如果是时间类型，使用formatDate函数格式化
      if (value && !Number.isNaN(Date.parse(value))) {
        return formatDate(new Date(value), props.timeFormat);
      }
      return value;
    }
    default: {
      return value;
    }
  }
});
</script>

<template>
  <div class="read-only-input-as-label">
    <!-- 使用 pre 标签保留换行符和空格，配合 CSS 类处理文本换行 -->
    <pre class="whitespace-pre-wrap break-words">{{ displayValue }}</pre>
  </div>
</template>

<style scoped>
.read-only-input-as-label {
  display: inline-block;
  padding: 0;
  font-size: 14px;
  line-height: 1.5714;
  color: rgb(0 0 0 / 88%);
}
</style>

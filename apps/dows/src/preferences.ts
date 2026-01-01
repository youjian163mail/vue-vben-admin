import { reactive, ref } from 'vue';

import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
  },
});

// 创建响应式全局状态
export const globalConfig = reactive({
  // 后台系统页面左上角Logo右边系统名称
  logo_right_system_name: ref('极效OS'),
});

import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:settings-outline',
      order: 100,
      title: $t('dows-project.title'),
    },
    name: 'DowsProject',
    path: '/dows-project',
    component: () => import('#/views/dows-project/project/list.vue'),
  },
];

export default routes;

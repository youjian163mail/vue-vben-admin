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
    children: [
      {
        path: '/dows-project/project',
        name: 'Project',
        meta: {
          icon: 'mdi:account-group',
          title: $t('dows-project.project.title'),
        },
        component: () => import('#/views/dows-project/project/list.vue'),
      },
    ],
  },
];

export default routes;

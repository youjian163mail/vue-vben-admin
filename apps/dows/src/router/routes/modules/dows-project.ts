import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:settings-outline',
      order: 100,
      title: $t('dows-project.title'),
    },
    name: 'Project',
    path: '/dows-project',
    children: [
      {
        path: '/dows-project/project-management',
        name: 'ProjectManagement',
        meta: {
          icon: 'mdi:account-group',
          title: $t('dows-project.project-management.title'),
        },
        component: () =>
          import('#/views/dows/project/project-management/list.vue'),
      },
    ],
  },
];

export default routes;

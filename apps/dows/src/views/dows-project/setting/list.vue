<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProjectApi } from '#/api/dows-project/project';
import type { ProjectSettingApi } from '#/api/dows-project/setting';

import { computed, watch } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProjectSetting,
  getProjectSettingList,
} from '#/api/dows-project/setting';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

interface Props {
  project?: ProjectApi.Project;
}

const props = withDefaults(defineProps<Props>(), {
  project: undefined,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

// 获取项目ID
const projectInstanceId = computed(() => props.project?.id);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
    wrapperClass: 'lg:grid-cols-2',
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: props.project ? 'auto' : 'calc(72vh - 180px)',
    scrollY: { enabled: true, gt: 10 },
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          // 如果有项目ID，则添加到查询参数中
          return await (projectInstanceId.value
            ? getProjectSettingList({
                page: page.currentPage,
                pageSize: page.pageSize,
                projectInstanceId: projectInstanceId.value,
                ...formValues,
              })
            : getProjectSettingList({
                page: page.currentPage,
                pageSize: page.pageSize,
                ...formValues,
              }));
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<ProjectSettingApi.ProjectSetting>,
});

// 监听项目变化并刷新数据
watch(
  () => props.project,
  async (newProject) => {
    if (newProject) {
      // 当项目变化时，重新查询数据
      gridApi.query();
    }
  },
  { immediate: true },
);

function onActionClick(
  e: OnActionClickParams<ProjectSettingApi.ProjectSetting>,
) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

function onEdit(row: ProjectSettingApi.ProjectSetting) {
  formDrawerApi.setData({ ...row, mode: 'edit' }).open();
}

function onDelete(row: ProjectSettingApi.ProjectSetting) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.settingKey]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteProjectSetting(row.projectSettingId)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.settingKey]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({ projectInstanceId: props.project?.id }).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer class="w-[600px]" @success="onRefresh" />

    <!-- 项目设置管理界面，当传入project参数时显示 -->
    <Grid v-if="project" :table-title="$t('dows-project.setting.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('dows-project.setting.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>

<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProjectApi } from '#/api/dows-project/project';
import type { ProjectTagApi } from '#/api/dows-project/tag';

import { computed, watch } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteProjectTag, getProjectTagList } from '#/api/dows-project/tag';
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

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'calc(70vh - 180px)',
    scrollY: { enabled: true, gt: 10 },
    keepSource: true,
    pagerConfig: {
      enabled: true,
      pageSize: 20,
      pageSizes: [10, 20, 30, 50, 100],
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getProjectTagList({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
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
  } as VxeTableGridOptions<ProjectTagApi.ProjectTag>,
});

// 获取项目ID
const projectId = computed(() => props.project?.id);

// Load tags when component is mounted or project changes
watch(
  () => props.project,
  async (newProject) => {
    if (newProject) {
      gridApi.setGridOptions({
        proxyConfig: {
          ajax: {
            query: async ({ page }, formValues) => {
              return await getProjectTagList({
                pageNum: page.currentPage,
                pageSize: page.pageSize,
                projectId: projectId.value,
                ...formValues,
              });
            },
          },
        },
      });
    }
  },
  { immediate: true },
);

function onActionClick(e: OnActionClickParams<ProjectTagApi.ProjectTag>) {
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

function onEdit(row: ProjectTagApi.ProjectTag) {
  formDrawerApi.setData({ ...row, mode: 'edit' }).open();
}

function onDelete(row: ProjectTagApi.ProjectTag) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.tagName]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteProjectTag(row.projectTagId)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.tagName]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

async function onStatusChange(row: ProjectTagApi.ProjectTag) {
  const newStatus = row.status === 1 ? 0 : 1;
  try {
    // 直接更新状态，不显示确认对话框
    await updateProjectTag(row.projectTagId, { status: newStatus });
    return true;
  } catch {
    return false;
  }
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

    <!-- 项目标签管理界面，当传入project参数时显示 -->
    <Grid v-if="project" :table-title="$t('dows-project.tag.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('dows-project.tag.name')]) }}
        </Button>
      </template>
    </Grid>

    <!-- 默认标签列表界面，当没有传入project参数时显示 -->
    <Grid v-else :table-title="$t('dows-project.tag.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('dows-project.tag.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>

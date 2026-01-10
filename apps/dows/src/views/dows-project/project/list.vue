<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProjectApi } from '#/api/dows-project/project';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteProject, getProjectList } from '#/api/dows-project/project';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import TagListModal from './modules/tag-list-modal.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getProjectList({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      height: 80, // 设置行高度为80px
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<ProjectApi.Project>,
});

function onActionClick(e: OnActionClickParams<ProjectApi.Project>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'tagManage': {
      onTagManagement(e.row);
      break;
    }
    case 'view': {
      onView(e.row);
      break;
    }
  }
}

function onView(row: ProjectApi.Project) {
  formDrawerApi.setData({ ...row, mode: 'view' }).open();
}

function onEdit(row: ProjectApi.Project) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: ProjectApi.Project) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.projectName]),
    duration: 0,
    key: 'action_process_msg',
  });
  // Ensure we're passing a valid string ID, using projectInstanceId as fallback if id is undefined
  const projectId = row.id ?? row.projectInstanceId;
  deleteProject(projectId)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.projectName]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

const selectedProject = ref<null | ProjectApi.Project>(null);
const tagManagementModalVisible = ref(false);

function onTagManagement(row: ProjectApi.Project) {
  selectedProject.value = row;
  tagManagementModalVisible.value = true;
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer class="w-[600px]" @success="onRefresh" />
    <TagListModal
      v-model:visible="tagManagementModalVisible"
      :project="selectedProject || undefined"
      @ok="tagManagementModalVisible = false"
      @cancel="tagManagementModalVisible = false"
    />
    <Grid :table-title="$t('dows-project.project.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('dows-project.project.name')]) }}
        </Button>
      </template>
      <template #header-progress>
        <div class="flex items-center justify-center">
          <span class="font-bold text-blue-600">📊 进度</span>
        </div>
      </template>
      <template #progress="{ row }">
        <div class="flex w-full items-center justify-center">
          <span
            v-if="Number(row.progress) === 100"
            class="mr-2 h-2 w-2 rounded-full bg-green-500"
          ></span>
          <span>
            {{
              Number(row.progress) === 100
                ? '已完成'
                : row.progress != null
                  ? `${Number(row.progress)}% 进行中`
                  : '0% 进行中'
            }}
          </span>
        </div>
      </template>
      <template #projectNameHeader>
        <span class="pl-4">{{ $t('dows-project.project.projectName') }}</span>
      </template>
    </Grid>
  </Page>
</template>

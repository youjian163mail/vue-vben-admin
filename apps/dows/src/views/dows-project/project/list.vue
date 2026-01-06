<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProjectApi } from '#/api/dows-project/project';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProject,
  getProjectList,
  updateProject,
} from '#/api/dows-project/project';
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
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
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

/**
 * 将Antd的Modal.confirm封装为promise，方便在异步函数中调用。
 * @param content 提示内容
 * @param title 提示标题
 */
function confirm(content: string, title: string) {
  return new Promise((reslove, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        reslove(true);
      },
      title,
    });
  });
}

async function onStatusChange(row: ProjectApi.Project) {
  const newStatus = row.status === 1 ? 0 : 1;
  try {
    await confirm(
      $t('ui.actionMessage.changeStatus', [
        row.projectName,
        newStatus === 1 ? $t('ui.status.enabled') : $t('ui.status.disabled'),
      ]),
      `切换状态`,
    );
    await updateProject(row.id, { status: newStatus });
    return true;
  } catch {
    return false;
  }
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
  deleteProject(row.id)
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
      :project="selectedProject"
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

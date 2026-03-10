<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { NCard, NButton, NSwitch, NEmpty, NSpin, NDataTable, NIcon, NModal, NForm, NFormItem, NInput } from 'naive-ui';
import { Add, Play, Trash2, History } from '@vicons/ionicons5';
import { useCronStore } from '@/stores/cron';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const cronStore = useCronStore();

const tasks = computed(() => cronStore.tasks);
const loading = computed(() => cronStore.loading);

const showCreateModal = ref(false);
const newTaskName = ref('');
const newTaskSchedule = ref('');

const columns = [
  {
    title: t('cron.name', 'Name'),
    key: 'name',
  },
  {
    title: t('cron.schedule', 'Schedule'),
    key: 'schedule',
  },
  {
    title: t('cron.status', 'Status'),
    key: 'status',
    render: (row: any) => {
      const colors: Record<string, string> = {
        idle: '#6b7280',
        running: '#3b82f6',
        error: '#ef4444',
      };
      return h('span', { style: { color: colors[row.status] || '#6b7280' } }, row.status);
    },
  },
  {
    title: t('cron.lastRun', 'Last Run'),
    key: 'lastRun',
    render: (row: any) => row.lastRun ? new Date(row.lastRun).toLocaleString() : '-',
  },
  {
    title: t('common.actions', 'Actions'),
    key: 'actions',
    render: (row: any) => {
      return h('div', { style: { display: 'flex', gap: '8px' } }, [
        h(NButton, { 
          size: 'small', 
          quaternary: true,
          onClick: () => cronStore.runTask(row.id)
        }, { icon: () => h(NIcon, { component: Play }) }),
        h(NButton, { 
          size: 'small', 
          quaternary: true,
          onClick: () => row.enabled ? cronStore.disableTask(row.id) : cronStore.enableTask(row.id)
        }, { default: () => row.enabled ? 'Disable' : 'Enable' }),
        h(NButton, { 
          size: 'small', 
          quaternary: true,
          type: 'error',
          onClick: () => cronStore.deleteTask(row.id)
        }, { icon: () => h(NIcon, { component: Trash2 }) }),
      ]);
    },
  },
];

import { h } from 'vue';

const handleCreateTask = async () => {
  if (!newTaskName.value || !newTaskSchedule.value) return;
  await cronStore.createTask(newTaskName.value, newTaskSchedule.value);
  showCreateModal.value = false;
  newTaskName.value = '';
  newTaskSchedule.value = '';
};

onMounted(async () => {
  await cronStore.loadTasks();
});
</script>

<template>
  <div class="cron-page">
    <div class="page-header">
      <div>
        <h1>{{ t('cron.title', 'Cron Tasks') }}</h1>
        <p class="page-description">{{ t('cron.description', 'Manage scheduled tasks') }}</p>
      </div>
      <NButton type="primary" @click="showCreateModal = true">
        <template #icon>
          <NIcon :component="Add" />
        </template>
        {{ t('cron.create', 'Create Task') }}
      </NButton>
    </div>

    <NSpin :show="loading">
      <NEmpty v-if="!loading && tasks.length === 0" :description="t('cron.empty', 'No scheduled tasks')" />
      
      <NCard v-else>
        <NDataTable :columns="columns" :data="tasks" :bordered="false" />
      </NCard>
    </NSpin>

    <NModal
      v-model:show="showCreateModal"
      preset="dialog"
      :title="t('cron.createTask', 'Create Task')"
      positive-text="Create"
      negative-text="Cancel"
      @positive-click="handleCreateTask"
    >
      <NForm>
        <NFormItem :label="t('cron.name', 'Name')">
          <NInput v-model:value="newTaskName" placeholder="Task name" />
        </NFormItem>
        <NFormItem :label="t('cron.schedule', 'Schedule')">
          <NInput v-model:value="newTaskSchedule" placeholder="* * * * * (cron expression)" />
        </NFormItem>
      </NForm>
    </NModal>
  </div>
</template>

<style scoped>
.cron-page {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.page-description {
  color: var(--n-text-color-3);
}
</style>

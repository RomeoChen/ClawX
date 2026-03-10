import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface CronTask {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  lastRun?: number;
  nextRun?: number;
  status: 'idle' | 'running' | 'error';
}

export const useCronStore = defineStore('cron', () => {
  const tasks = ref<CronTask[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadTasks = async () => {
    loading.value = true;
    try {
      const result = await window.electron.ipcRenderer.invoke('cron:list');
      tasks.value = result?.tasks ?? [];
    } catch (e) {
      error.value = String(e);
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (name: string, schedule: string) => {
    try {
      await window.electron.ipcRenderer.invoke('cron:create', { name, schedule });
      await loadTasks();
    } catch (e) {
      error.value = String(e);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('cron:delete', id);
      await loadTasks();
    } catch (e) {
      error.value = String(e);
    }
  };

  const enableTask = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('cron:enable', id);
      await loadTasks();
    } catch (e) {
      error.value = String(e);
    }
  };

  const disableTask = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('cron:disable', id);
      await loadTasks();
    } catch (e) {
      error.value = String(e);
    }
  };

  const runTask = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('cron:run', id);
    } catch (e) {
      error.value = String(e);
    }
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    deleteTask,
    enableTask,
    disableTask,
    runTask,
  };
});

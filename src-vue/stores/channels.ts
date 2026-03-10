import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Channel {
  id: string;
  name: string;
  type: string;
  status: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export const useChannelsStore = defineStore('channels', () => {
  const channels = ref<Channel[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadChannels = async () => {
    loading.value = true;
    try {
      const result = await window.electron.ipcRenderer.invoke('channels:list');
      channels.value = result?.channels ?? [];
    } catch (e) {
      error.value = String(e);
    } finally {
      loading.value = false;
    }
  };

  const enableChannel = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('channels:enable', id);
      await loadChannels();
    } catch (e) {
      error.value = String(e);
    }
  };

  const disableChannel = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('channels:disable', id);
      await loadChannels();
    } catch (e) {
      error.value = String(e);
    }
  };

  const configureChannel = async (id: string, config: Record<string, unknown>) => {
    try {
      await window.electron.ipcRenderer.invoke('channels:configure', { id, config });
      await loadChannels();
    } catch (e) {
      error.value = String(e);
    }
  };

  return {
    channels,
    loading,
    error,
    loadChannels,
    enableChannel,
    disableChannel,
    configureChannel,
  };
});

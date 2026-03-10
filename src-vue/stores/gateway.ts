import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type GatewayStatus = 'stopped' | 'starting' | 'running' | 'error';

export const useGatewayStore = defineStore('gateway', () => {
  const status = ref<GatewayStatus>('stopped');
  const error = ref<string | null>(null);
  const url = ref<string | null>(null);
  const connected = ref(false);
  const lastConnected = ref<number | null>(null);

  const isRunning = computed(() => status.value === 'running');
  const isStarting = computed(() => status.value === 'starting');

  const init = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('gateway:getStatus');
      if (result) {
        status.value = result.status;
        error.value = result.error;
        url.value = result.url;
        connected.value = result.connected;
        lastConnected.value = result.lastConnected;
      }
    } catch (e) {
      console.error('Failed to init gateway:', e);
    }
  };

  const start = async () => {
    status.value = 'starting';
    try {
      await window.electron.ipcRenderer.invoke('gateway:start');
    } catch (e) {
      status.value = 'error';
      error.value = String(e);
    }
  };

  const stop = async () => {
    try {
      await window.electron.ipcRenderer.invoke('gateway:stop');
      status.value = 'stopped';
      connected.value = false;
    } catch (e) {
      error.value = String(e);
    }
  };

  const restart = async () => {
    await stop();
    await start();
  };

  // Listen for gateway status changes
  if (typeof window !== 'undefined' && window.electron?.ipcRenderer) {
    window.electron.ipcRenderer.on('gateway:statusChanged', (_event: unknown, data: { status: GatewayStatus; error?: string }) => {
      status.value = data.status;
      if (data.error) error.value = data.error;
      if (data.status === 'running') {
        connected.value = true;
        lastConnected.value = Date.now();
      } else if (data.status === 'stopped') {
        connected.value = false;
      }
    });

    window.electron.ipcRenderer.on('gateway:connected', () => {
      connected.value = true;
      lastConnected.value = Date.now();
    });

    window.electron.ipcRenderer.on('gateway:disconnected', () => {
      connected.value = false;
    });
  }

  return {
    status,
    error,
    url,
    connected,
    lastConnected,
    isRunning,
    isStarting,
    init,
    start,
    stop,
    restart,
  };
});

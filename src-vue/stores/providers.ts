import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Provider {
  id: string;
  name: string;
  provider: string;
  models: string[];
  enabled: boolean;
  hasKey: boolean;
  configured: boolean;
}

export const useProvidersStore = defineStore('providers', () => {
  const providers = ref<Provider[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const enabledProviders = computed(() => providers.value.filter(p => p.enabled));

  const loadProviders = async () => {
    loading.value = true;
    try {
      const result = await window.electron.ipcRenderer.invoke('providers:list');
      providers.value = result?.providers ?? [];
    } catch (e) {
      error.value = String(e);
    } finally {
      loading.value = false;
    }
  };

  const addProvider = async (config: { provider: string; apiKey: string; baseUrl?: string }) => {
    try {
      await window.electron.ipcRenderer.invoke('providers:add', config);
      await loadProviders();
    } catch (e) {
      error.value = String(e);
    }
  };

  const removeProvider = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('providers:remove', id);
      await loadProviders();
    } catch (e) {
      error.value = String(e);
    }
  };

  const setDefaultProvider = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('providers:setDefault', id);
      await loadProviders();
    } catch (e) {
      error.value = String(e);
    }
  };

  return {
    providers,
    loading,
    error,
    enabledProviders,
    loadProviders,
    addProvider,
    removeProvider,
    setDefaultProvider,
  };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';

type Theme = 'light' | 'dark' | 'system';
type UpdateChannel = 'stable' | 'beta' | 'dev';

export type { Theme, UpdateChannel };

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<Theme>('system');
  const language = ref('en');
  const startMinimized = ref(false);
  const launchAtStartup = ref(false);
  const gatewayAutoStart = ref(true);
  const gatewayPort = ref(18789);
  const proxyEnabled = ref(false);
  const proxyServer = ref('');
  const proxyHttpServer = ref('');
  const proxyHttpsServer = ref('');
  const proxyAllServer = ref('');
  const proxyBypassRules = ref('<local>;localhost;127.0.0.1;::1');
  const updateChannel = ref<UpdateChannel>('stable');
  const autoCheckUpdate = ref(true);
  const autoDownloadUpdate = ref(false);
  const sidebarCollapsed = ref(false);
  const devModeUnlocked = ref(false);
  const setupComplete = ref(false);

  const init = async () => {
    try {
      const settings = await window.electron.ipcRenderer.invoke('settings:getAll');
      if (settings) {
        theme.value = settings.theme ?? 'system';
        language.value = settings.language ?? 'en';
        startMinimized.value = settings.startMinimized ?? false;
        launchAtStartup.value = settings.launchAtStartup ?? false;
        gatewayAutoStart.value = settings.gatewayAutoStart ?? true;
        gatewayPort.value = settings.gatewayPort ?? 18789;
        proxyEnabled.value = settings.proxyEnabled ?? false;
        proxyServer.value = settings.proxyServer ?? '';
        proxyHttpServer.value = settings.proxyHttpServer ?? '';
        proxyHttpsServer.value = settings.proxyHttpsServer ?? '';
        proxyAllServer.value = settings.proxyAllServer ?? '';
        proxyBypassRules.value = settings.proxyBypassRules ?? '<local>;localhost;127.0.0.1;::1';
        updateChannel.value = settings.updateChannel ?? 'stable';
        autoCheckUpdate.value = settings.autoCheckUpdate ?? true;
        autoDownloadUpdate.value = settings.autoDownloadUpdate ?? false;
        sidebarCollapsed.value = settings.sidebarCollapsed ?? false;
        devModeUnlocked.value = settings.devModeUnlocked ?? false;
        setupComplete.value = settings.setupComplete ?? false;
      }
    } catch (e) {
      console.error('Failed to init settings:', e);
    }
  };

  const setTheme = (value: Theme) => {
    theme.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { theme: value });
  };

  const setLanguage = (value: string) => {
    language.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { language: value });
  };

  const setStartMinimized = (value: boolean) => {
    startMinimized.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { startMinimized: value });
  };

  const setLaunchAtStartup = (value: boolean) => {
    launchAtStartup.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { launchAtStartup: value });
  };

  const setGatewayAutoStart = (value: boolean) => {
    gatewayAutoStart.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { gatewayAutoStart: value });
  };

  const setGatewayPort = (value: number) => {
    gatewayPort.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { gatewayPort: value });
  };

  const setProxyEnabled = (value: boolean) => {
    proxyEnabled.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { proxyEnabled: value });
  };

  const setProxyServer = (value: string) => {
    proxyServer.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { proxyServer: value });
  };

  const setProxyHttpServer = (value: string) => {
    proxyHttpServer.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { proxyHttpServer: value });
  };

  const setProxyHttpsServer = (value: string) => {
    proxyHttpsServer.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { proxyHttpsServer: value });
  };

  const setProxyAllServer = (value: string) => {
    proxyAllServer.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { proxyAllServer: value });
  };

  const setProxyBypassRules = (value: string) => {
    proxyBypassRules.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { proxyBypassRules: value });
  };

  const setUpdateChannel = (value: UpdateChannel) => {
    updateChannel.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { updateChannel: value });
  };

  const setAutoCheckUpdate = (value: boolean) => {
    autoCheckUpdate.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { autoCheckUpdate: value });
  };

  const setAutoDownloadUpdate = (value: boolean) => {
    autoDownloadUpdate.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { autoDownloadUpdate: value });
  };

  const setSidebarCollapsed = (value: boolean) => {
    sidebarCollapsed.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { sidebarCollapsed: value });
  };

  const setDevModeUnlocked = (value: boolean) => {
    devModeUnlocked.value = value;
    window.electron.ipcRenderer.invoke('settings:set', { devModeUnlocked: value });
  };

  const markSetupComplete = () => {
    setupComplete.value = true;
    window.electron.ipcRenderer.invoke('settings:set', { setupComplete: true });
  };

  const resetSettings = () => {
    theme.value = 'system';
    language.value = 'en';
    startMinimized.value = false;
    launchAtStartup.value = false;
    gatewayAutoStart.value = true;
    gatewayPort.value = 18789;
    proxyEnabled.value = false;
    proxyServer.value = '';
    proxyHttpServer.value = '';
    proxyHttpsServer.value = '';
    proxyAllServer.value = '';
    proxyBypassRules.value = '<local>;localhost;127.0.0.1;::1';
    updateChannel.value = 'stable';
    autoCheckUpdate.value = true;
    autoDownloadUpdate.value = false;
    sidebarCollapsed.value = false;
    devModeUnlocked.value = false;
    window.electron.ipcRenderer.invoke('settings:reset');
  };

  return {
    theme,
    language,
    startMinimized,
    launchAtStartup,
    gatewayAutoStart,
    gatewayPort,
    proxyEnabled,
    proxyServer,
    proxyHttpServer,
    proxyHttpsServer,
    proxyAllServer,
    proxyBypassRules,
    updateChannel,
    autoCheckUpdate,
    autoDownloadUpdate,
    sidebarCollapsed,
    devModeUnlocked,
    setupComplete,
    init,
    setTheme,
    setLanguage,
    setStartMinimized,
    setLaunchAtStartup,
    setGatewayAutoStart,
    setGatewayPort,
    setProxyEnabled,
    setProxyServer,
    setProxyHttpServer,
    setProxyHttpsServer,
    setProxyAllServer,
    setProxyBypassRules,
    setUpdateChannel,
    setAutoCheckUpdate,
    setAutoDownloadUpdate,
    setSidebarCollapsed,
    setDevModeUnlocked,
    markSetupComplete,
    resetSettings,
  };
});

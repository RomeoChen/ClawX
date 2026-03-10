<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue';
import { NCard, NTabs, NTabPane, NSwitch, NInput, NSelect, NButton, NDivider, NForm, NFormItem, NGrid, NGi, NIcon } from 'naive-ui';
import { useSettingsStore } from '@/stores/settings';
import { useGatewayStore } from '@/stores/gateway';
import { useProvidersStore } from '@/stores/providers';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const settingsStore = useSettingsStore();
const gatewayStore = useGatewayStore();
const providersStore = useProvidersStore();

const theme = computed(() => settingsStore.theme);
const language = computed(() => settingsStore.language);
const gatewayAutoStart = computed(() => settingsStore.gatewayAutoStart);
const gatewayPort = computed(() => settingsStore.gatewayPort);
const proxyEnabled = computed(() => settingsStore.proxyEnabled);

const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' },
];

const activeTab = ref('general');

const handleThemeChange = (value: string) => {
  settingsStore.setTheme(value as 'light' | 'dark' | 'system');
};

const handleLanguageChange = (value: string) => {
  settingsStore.setLanguage(value);
  locale.value = value;
};

const handleGatewayAutoStartChange = (value: boolean) => {
  settingsStore.setGatewayAutoStart(value);
};

const handleGatewayPortChange = (value: number) => {
  settingsStore.setGatewayPort(value);
};

const handleProxyEnabledChange = (value: boolean) => {
  settingsStore.setProxyEnabled(value);
};

onMounted(async () => {
  await settingsStore.init();
  await gatewayStore.init();
  await providersStore.loadProviders();
});
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>{{ t('settings.title', 'Settings') }}</h1>
    </div>

    <NTabs v-model:value="activeTab" type="line">
      <NTabPane name="general" :tab="t('settings.general', 'General')">
        <NCard>
          <NForm label-placement="top">
            <NFormItem :label="t('settings.theme', 'Theme')">
              <NSelect
                :value="theme"
                :options="themeOptions"
                @update:value="handleThemeChange"
              />
            </NFormItem>

            <NFormItem :label="t('settings.language', 'Language')">
              <NSelect
                :value="language"
                :options="languageOptions"
                @update:value="handleLanguageChange"
              />
            </NFormItem>
          </NForm>
        </NCard>
      </NTabPane>

      <NTabPane name="gateway" :tab="t('settings.gateway', 'Gateway')">
        <NCard>
          <NForm label-placement="top">
            <NFormItem :label="t('settings.gatewayAutoStart', 'Auto Start Gateway')">
              <NSwitch
                :value="gatewayAutoStart"
                @update:value="handleGatewayAutoStartChange"
              />
            </NFormItem>

            <NFormItem :label="t('settings.gatewayPort', 'Gateway Port')">
              <NInput
                :value="gatewayPort"
                type="number"
                @update:value="handleGatewayPortChange"
              />
            </NFormItem>

            <NDivider />

            <NFormItem :label="t('settings.gatewayStatus', 'Status')">
              <div class="gateway-status">
                <span class="status-dot" :class="gatewayStore.status"></span>
                {{ gatewayStore.status }}
                <NButton
                  v-if="gatewayStore.status === 'running'"
                  size="small"
                  quaternary
                  @click="gatewayStore.stop()"
                >
                  {{ t('common.stop', 'Stop') }}
                </NButton>
                <NButton
                  v-else
                  size="small"
                  quaternary
                  @click="gatewayStore.start()"
                >
                  {{ t('common.start', 'Start') }}
                </NButton>
              </div>
            </NFormItem>
          </NForm>
        </NCard>
      </NTabPane>

      <NTabPane name="proxy" :tab="t('settings.proxy', 'Proxy')">
        <NCard>
          <NForm label-placement="top">
            <NFormItem :label="t('settings.proxyEnabled', 'Enable Proxy')">
              <NSwitch
                :value="proxyEnabled"
                @update:value="handleProxyEnabledChange"
              />
            </NFormItem>

            <template v-if="proxyEnabled">
              <NFormItem :label="t('settings.proxyServer', 'Proxy Server')">
                <NInput
                  :value="settingsStore.proxyServer"
                  placeholder="http://proxy:8080"
                  @update:value="settingsStore.setProxyServer($event)"
                />
              </NFormItem>

              <NFormItem :label="t('settings.proxyBypass', 'Bypass Rules')">
                <NInput
                  :value="settingsStore.proxyBypassRules"
                  placeholder="<local>;localhost;127.0.0.1"
                  @update:value="settingsStore.setProxyBypassRules($event)"
                />
              </NFormItem>
            </template>
          </NForm>
        </NCard>
      </NTabPane>

      <NTabPane name="providers" :tab="t('settings.providers', 'AI Providers')">
        <NCard>
          <div class="providers-list">
            <div v-for="provider in providersStore.providers" :key="provider.id" class="provider-item">
              <div class="provider-info">
                <h4>{{ provider.name }}</h4>
                <span>{{ provider.provider }}</span>
              </div>
              <div class="provider-status">
                <NSwitch
                  :value="provider.enabled"
                  @update:value="providersStore.setDefaultProvider(provider.id)"
                />
              </div>
            </div>
          </div>
        </NCard>
      </NTabPane>
    </NTabs>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 800px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.gateway-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.running {
  background: #22c55e;
}

.status-dot.starting {
  background: #f59e0b;
}

.status-dot.stopped {
  background: #6b7280;
}

.status-dot.error {
  background: #ef4444;
}

.providers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.provider-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
}

.provider-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.provider-info span {
  font-size: 0.75rem;
  color: var(--n-text-color-3);
}
</style>

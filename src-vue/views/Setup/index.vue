<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NButton, NStep, NSteps, NForm, NFormItem, NInput, NSelect, NSpin } from 'naive-ui';
import { useSettingsStore } from '@/stores/settings';
import { useGatewayStore } from '@/stores/gateway';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();
const settingsStore = useSettingsStore();
const gatewayStore = useGatewayStore();

const currentStep = ref(1);
const loading = ref(false);

const language = ref('en');
const theme = ref('system');

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' },
];

const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const handleComplete = async () => {
  loading.value = true;
  try {
    settingsStore.setLanguage(language.value);
    settingsStore.setTheme(theme.value as 'light' | 'dark' | 'system');
    locale.value = language.value;
    settingsStore.markSetupComplete();
    router.push('/');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await gatewayStore.init();
});
</script>

<template>
  <div class="setup-page">
    <div class="setup-container">
      <div class="setup-header">
        <h1>Welcome to ClawX</h1>
        <p>Let's get you started</p>
      </div>

      <NCard>
        <NSteps :current="currentStep">
          <NStep :title="t('setup.welcome', 'Welcome')" />
          <NStep :title="t('setup.preferences', 'Preferences')" />
          <NStep :title="t('setup.complete', 'Complete')" />
        </NSteps>

        <div class="setup-content">
          <NSpin :show="loading">
            <div v-if="currentStep === 1" class="step-content">
              <h2>Welcome to ClawX</h2>
              <p>ClawX is a powerful AI assistant that helps you communicate and automate tasks across multiple channels.</p>
              <NButton type="primary" @click="currentStep = 2">
                {{ t('common.next', 'Next') }}
              </NButton>
            </div>

            <div v-else-if="currentStep === 2" class="step-content">
              <h2>{{ t('setup.preferences', 'Preferences') }}</h2>
              <NForm label-placement="top">
                <NFormItem :label="t('settings.language', 'Language')">
                  <NSelect
                    v-model:value="language"
                    :options="languageOptions"
                  />
                </NFormItem>
                <NFormItem :label="t('settings.theme', 'Theme')">
                  <NSelect
                    v-model:value="theme"
                    :options="themeOptions"
                  />
                </NFormItem>
              </NForm>
              <div class="step-actions">
                <NButton @click="currentStep = 1">
                  {{ t('common.back', 'Back') }}
                </NButton>
                <NButton type="primary" @click="currentStep = 3">
                  {{ t('common.next', 'Next') }}
                </NButton>
              </div>
            </div>

            <div v-else-if="currentStep === 3" class="step-content">
              <h2>{{ t('setup.complete', 'Complete') }}</h2>
              <p>You're all set! Click below to start using ClawX.</p>
              <div class="gateway-status">
                <span>Gateway Status: </span>
                <span :class="gatewayStore.status">{{ gatewayStore.status }}</span>
              </div>
              <div class="step-actions">
                <NButton @click="currentStep = 2">
                  {{ t('common.back', 'Back') }}
                </NButton>
                <NButton type="primary" @click="handleComplete">
                  {{ t('setup.start', 'Start Using ClawX') }}
                </NButton>
              </div>
            </div>
          </NSpin>
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.setup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--n-color);
}

.setup-container {
  width: 100%;
  max-width: 500px;
  padding: 24px;
}

.setup-header {
  text-align: center;
  margin-bottom: 24px;
}

.setup-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.setup-header p {
  color: var(--n-text-color-3);
}

.setup-content {
  margin-top: 32px;
}

.step-content {
  text-align: center;
}

.step-content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.step-content p {
  color: var(--n-text-color-3);
  margin-bottom: 24px;
  line-height: 1.6;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.gateway-status {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--n-color);
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  margin-bottom: 24px;
}

.gateway-status .running {
  color: #22c55e;
}

.gateway-status .starting {
  color: #f59e0b;
}

.gateway-status .stopped,
.gateway-status .error {
  color: #6b7280;
}
</style>

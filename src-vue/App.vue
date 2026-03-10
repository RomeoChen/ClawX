<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NMessageProvider, NDialogProvider, NNotificationProvider } from 'naive-ui';
import { RouterView } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { useGatewayStore } from '@/stores/gateway';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const settingsStore = useSettingsStore();
const gatewayStore = useGatewayStore();

const theme = computed(() => settingsStore.theme);
const setupComplete = computed(() => settingsStore.setupComplete);
const language = computed(() => settingsStore.language);

const isReady = ref(false);

const applyTheme = (themeValue: string) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (themeValue === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(themeValue);
  }
};

watch(theme, (newTheme) => {
  if (newTheme) {
    applyTheme(newTheme);
  }
});

onMounted(async () => {
  await settingsStore.init();
  
  if (language.value && language.value !== locale.value) {
    locale.value = language.value;
  }
  
  await gatewayStore.init();
  
  applyTheme(settingsStore.theme);
  
  isReady.value = true;

  if (!setupComplete.value && !route.path.startsWith('/setup')) {
    router.push('/setup');
  }
});

watch(() => settingsStore.setupComplete, (complete) => {
  if (!complete && !route.path.startsWith('/setup')) {
    router.push('/setup');
  }
});
</script>

<template>
  <NMessageProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <RouterView v-if="isReady" />
        <div v-else class="flex items-center justify-center h-screen bg-background text-foreground">
          <span class="text-lg">Loading...</span>
        </div>
      </NNotificationProvider>
    </NDialogProvider>
  </NMessageProvider>
</template>

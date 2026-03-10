<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, darkTheme } from 'naive-ui';
import { computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const props = defineProps<{
  delayDuration?: number;
}>();

const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme === 'dark' ? darkTheme : null);
</script>

<template>
  <NConfigProvider :theme="theme">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <slot />
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

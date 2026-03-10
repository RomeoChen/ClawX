<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { NCard, NButton, NSwitch, NEmpty, NSpin, NGrid, NGi, NIcon } from 'naive-ui';
import { Radio, CheckmarkCircle, CloseCircle, Settings } from '@vicons/ionicons5';
import { useChannelsStore } from '@/stores/channels';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const channelsStore = useChannelsStore();

const channels = computed(() => channelsStore.channels);
const loading = computed(() => channelsStore.loading);

const handleToggle = async (channel: any) => {
  if (channel.enabled) {
    await channelsStore.disableChannel(channel.id);
  } else {
    await channelsStore.enableChannel(channel.id);
  }
};

onMounted(async () => {
  await channelsStore.loadChannels();
});
</script>

<template>
  <div class="channels-page">
    <div class="page-header">
      <h1>{{ t('channels.title', 'Channels') }}</h1>
      <p class="page-description">{{ t('channels.description', 'Manage your communication channels') }}</p>
    </div>

    <NSpin :show="loading">
      <NEmpty v-if="!loading && channels.length === 0" :description="t('channels.empty', 'No channels available')" />
      
      <NGrid v-else :cols="3" :x-gap="16" :y-gap="16">
        <NGi v-for="channel in channels" :key="channel.id">
          <NCard class="channel-card">
            <div class="channel-header">
              <NIcon :component="Radio" size="24" />
              <div class="channel-info">
                <h3>{{ channel.name }}</h3>
                <span class="channel-type">{{ channel.type }}</span>
              </div>
              <NSwitch :value="channel.enabled" @update:value="handleToggle(channel)" />
            </div>
            
            <div class="channel-status">
              <NIcon v-if="channel.enabled" :component="CheckmarkCircle" class="status-enabled" />
              <NIcon v-else :component="CloseCircle" class="status-disabled" />
              <span>{{ channel.enabled ? t('channels.enabled', 'Enabled') : t('channels.disabled', 'Disabled') }}</span>
            </div>

            <div class="channel-actions">
              <NButton size="small" quaternary>
                <template #icon>
                  <NIcon :component="Settings" />
                </template>
                {{ t('common.settings', 'Settings') }}
              </NButton>
            </div>
          </NCard>
        </NGi>
      </NGrid>
    </NSpin>
  </div>
</template>

<style scoped>
.channels-page {
  max-width: 1200px;
}

.page-header {
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

.channel-card {
  height: 100%;
}

.channel-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.channel-info {
  flex: 1;
}

.channel-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.channel-type {
  font-size: 0.75rem;
  color: var(--n-text-color-3);
  text-transform: uppercase;
}

.channel-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  margin-bottom: 12px;
}

.status-enabled {
  color: #22c55e;
}

.status-disabled {
  color: #6b7280;
}

.channel-actions {
  display: flex;
  justify-content: flex-end;
}
</style>

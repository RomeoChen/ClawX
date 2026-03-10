<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NGrid, NGi, NStatistic, NSpin } from 'naive-ui';
import { useSettingsStore } from '@/stores/settings';
import { useGatewayStore } from '@/stores/gateway';
import { useChatStore } from '@/stores/chat';
import { useChannelsStore } from '@/stores/channels';
import { useSkillsStore } from '@/stores/skills';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const settingsStore = useSettingsStore();
const gatewayStore = useGatewayStore();
const chatStore = useChatStore();
const channelsStore = useChannelsStore();
const skillsStore = useSkillsStore();

const loading = ref(true);

const gatewayStatus = computed(() => gatewayStore.status);
const channelsCount = computed(() => channelsStore.channels.length);
const skillsCount = computed(() => skillsStore.skills.length);
const messageCount = computed(() => chatStore.messages.length);

const statusColor = computed(() => {
  switch (gatewayStore.status) {
    case 'running': return '#22c55e';
    case 'starting': return '#f59e0b';
    case 'error': return '#ef4444';
    default: return '#6b7280';
  }
});

onMounted(async () => {
  await Promise.all([
    settingsStore.init(),
    gatewayStore.init(),
    chatStore.loadHistory(),
    channelsStore.loadChannels(),
    skillsStore.loadSkills(),
  ]);
  loading.value = false;
});
</script>

<template>
  <div class="dashboard">
    <h1 class="page-title">{{ t('dashboard.title', 'Dashboard') }}</h1>

    <NSpin :show="loading">
      <NGrid :cols="4" :x-gap="16" :y-gap="16">
        <NGi>
          <NCard class="stat-card">
            <NStatistic :label="t('dashboard.gatewayStatus', 'Gateway')">
              <template #default>
                <div class="status-indicator" :style="{ backgroundColor: statusColor }"></div>
                {{ gatewayStatus }}
              </template>
            </NStatistic>
          </NCard>
        </NGi>

        <NGi>
          <NCard class="stat-card">
            <NStatistic :label="t('dashboard.channels', 'Channels')" :value="channelsCount" />
          </NCard>
        </NGi>

        <NGi>
          <NCard class="stat-card">
            <NStatistic :label="t('dashboard.skills', 'Skills')" :value="skillsCount" />
          </NCard>
        </NGi>

        <NGi>
          <NCard class="stat-card">
            <NStatistic :label="t('dashboard.messages', 'Messages')" :value="messageCount" />
          </NCard>
        </NGi>
      </NGrid>

      <div class="quick-actions">
        <h2>{{ t('dashboard.quickActions', 'Quick Actions') }}</h2>
        <NGrid :cols="3" :x-gap="16" :y-gap="16">
          <NGi>
            <NCard class="action-card" @click="router.push('/')">
              <div class="action-content">
                <h3>{{ t('sidebar.newChat', 'New Chat') }}</h3>
                <p>{{ t('dashboard.newChatDesc', 'Start a new conversation') }}</p>
              </div>
            </NCard>
          </NGi>

          <NGi>
            <NCard class="action-card" @click="router.push('/channels')">
              <div class="action-content">
                <h3>{{ t('sidebar.channels', 'Channels') }}</h3>
                <p>{{ t('dashboard.manageChannels', 'Manage communication channels') }}</p>
              </div>
            </NCard>
          </NGi>

          <NGi>
            <NCard class="action-card" @click="router.push('/settings')">
              <div class="action-content">
                <h3>{{ t('sidebar.settings', 'Settings') }}</h3>
                <p>{{ t('dashboard.configureApp', 'Configure application settings') }}</p>
              </div>
            </NCard>
          </NGi>
        </NGrid>
      </div>
    </NSpin>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.stat-card {
  height: 100%;
}

:deep(.n-statistic .n-statistic-value) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.quick-actions {
  margin-top: 32px;
}

.quick-actions h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.action-card {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.action-content p {
  font-size: 0.875rem;
  color: var(--n-text-color-3);
}
</style>

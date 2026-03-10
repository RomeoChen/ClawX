<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NIcon } from 'naive-ui';
import {
  MessageSquare,
  Home,
  Radio,
  Puzzle,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Terminal,
  ExternalLink,
  Trash2,
} from '@vicons/ionicons5';
import { useSettingsStore } from '@/stores/settings';
import { useChatStore } from '@/stores/chat';
import { useI18n } from 'vue-i18n';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const settingsStore = useSettingsStore();
const chatStore = useChatStore();

const sidebarCollapsed = computed(() => settingsStore.sidebarCollapsed);
const devModeUnlocked = computed(() => settingsStore.devModeUnlocked);
const sessions = computed(() => chatStore.sessions);
const currentSessionKey = computed(() => chatStore.currentSessionKey);

const sessionToDelete = ref<{ key: string; label: string } | null>(null);

const isOnChat = computed(() => route.path === '/');

const mainSessions = computed(() => sessions.value.filter((s) => s.key.endsWith(':main')));
const otherSessions = computed(() => sessions.value.filter((s) => !s.key.endsWith(':main')));

const navItems = [
  { to: '/cron', icon: Clock, label: 'sidebar.cronTasks' },
  { to: '/skills', icon: Puzzle, label: 'sidebar.skills' },
  { to: '/channels', icon: Radio, label: 'sidebar.channels' },
  { to: '/dashboard', icon: Home, label: 'sidebar.dashboard' },
  { to: '/settings', icon: Settings, label: 'sidebar.settings' },
];

const openDevConsole = async () => {
  try {
    const result = await window.electron.ipcRenderer.invoke('gateway:getControlUiUrl');
    if (result?.success && result?.url) {
      window.electron.openExternal(result.url);
    }
  } catch (err) {
    console.error('Error opening Dev Console:', err);
  }
};

const handleNewChat = () => {
  if (chatStore.messages.length > 0) {
    chatStore.newSession();
  }
  router.push('/');
};

const handleDeleteSession = async () => {
  if (!sessionToDelete.value) return;
  await chatStore.deleteSession(sessionToDelete.value.key);
  if (currentSessionKey.value === sessionToDelete.value.key) {
    router.push('/');
  }
  sessionToDelete.value = null;
};

onMounted(async () => {
  await chatStore.loadSessions();
});
</script>

<template>
  <aside :class="['flex shrink-0 flex-col border-r bg-background transition-all duration-300', sidebarCollapsed ? 'w-16' : 'w-64']">
    <nav class="flex-1 overflow-hidden flex flex-col p-2 gap-1">
      <!-- New Chat Button -->
      <button
        @click="handleNewChat"
        :class="[
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground text-muted-foreground',
          sidebarCollapsed && 'justify-center px-2'
        ]"
      >
        <NIcon :component="MessageSquare" class="h-5 w-5 shrink-0" />
        <span v-if="!sidebarCollapsed" class="flex-1 text-left">{{ t('sidebar.newChat') }}</span>
      </button>

      <!-- Navigation Items -->
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          route.path === item.to ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
          sidebarCollapsed && 'justify-center px-2'
        ]"
      >
        <NIcon :component="item.icon" class="h-5 w-5 shrink-0" />
        <span v-if="!sidebarCollapsed" class="flex-1">{{ t(item.label) }}</span>
      </router-link>

      <!-- Session List -->
      <div v-if="!sidebarCollapsed && sessions.length > 0" class="mt-1 overflow-y-auto max-h-72 space-y-0.5">
        <div
          v-for="s in [...mainSessions, ...[...otherSessions].sort((a, b) =>
            (chatStore.sessionLastActivity[b.key] ?? 0) - (chatStore.sessionLastActivity[a.key] ?? 0)
          )]"
          :key="s.key"
          class="group relative flex items-center"
        >
          <button
            @click="chatStore.switchSession(s.key); router.push('/')"
            :class="[
              'w-full text-left rounded-md px-3 py-1.5 text-sm truncate transition-colors',
              !s.key.endsWith(':main') && 'pr-7',
              'hover:bg-accent hover:text-accent-foreground',
              isOnChat && currentSessionKey === s.key
                ? 'bg-accent/60 text-accent-foreground font-medium'
                : 'text-muted-foreground',
            ]"
          >
            {{ chatStore.sessionLabels[s.key] ?? s.displayName ?? s.key }}
          </button>
          <button
            v-if="!s.key.endsWith(':main')"
            @click.stop="sessionToDelete = { key: s.key, label: chatStore.sessionLabels[s.key] ?? s.displayName ?? s.key }"
            :class="[
              'absolute right-1 flex items-center justify-center rounded p-0.5 transition-opacity',
              'opacity-0 group-hover:opacity-100',
              'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
            ]"
          >
            <NIcon :component="Trash2" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="p-2 space-y-2">
      <Button
        v-if="devModeUnlocked && !sidebarCollapsed"
        variant="ghost"
        size="sm"
        class="w-full justify-start"
        @click="openDevConsole"
      >
        <NIcon :component="Terminal" class="h-4 w-4 mr-2" />
        {{ t('sidebar.devConsole') }}
        <NIcon :component="ExternalLink" class="h-3 w-3 ml-auto" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        class="w-full"
        @click="settingsStore.setSidebarCollapsed(!sidebarCollapsed)"
      >
        <NIcon :component="sidebarCollapsed ? ChevronRight : ChevronLeft" class="h-4 w-4" />
      </Button>
    </div>

    <ConfirmDialog
      :open="!!sessionToDelete"
      :title="t('common.confirm', 'Confirm')"
      :message="sessionToDelete ? t('sidebar.deleteSessionConfirm', `Delete \&quot;${sessionToDelete.label}\&quot;?`) : ''"
      :confirm-label="t('common.delete', 'Delete')"
      :cancel-label="t('common.cancel', 'Cancel')"
      variant="destructive"
      @confirm="handleDeleteSession"
      @cancel="sessionToDelete = null"
    />
  </aside>
</template>

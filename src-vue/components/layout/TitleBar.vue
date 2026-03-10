<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Minus, Square, X, Copy } from '@vicons/ionicons5';

const platform = ref('win32');
const isMaximized = ref(false);

const handleMinimize = () => {
  window.electron.ipcRenderer.invoke('window:minimize');
};

const handleMaximize = async () => {
  await window.electron.ipcRenderer.invoke('window:maximize');
  const result = await window.electron.ipcRenderer.invoke('window:isMaximized');
  isMaximized.value = result ?? false;
};

const handleClose = () => {
  window.electron.ipcRenderer.invoke('window:close');
};

onMounted(async () => {
  try {
    const result = await window.electron.ipcRenderer.invoke('window:getPlatform');
    platform.value = result?.platform ?? 'win32';
    isMaximized.value = result?.isMaximized ?? false;
  } catch (e) {
    console.error('Failed to get platform:', e);
  }

  window.electron.ipcRenderer.on('window:maximized', () => {
    isMaximized.value = true;
  });
  
  window.electron.ipcRenderer.on('window:unmaximized', () => {
    isMaximized.value = false;
  });
});
</script>

<template>
  <!-- macOS: drag region only -->
  <div v-if="platform === 'darwin'" class="drag-region h-10 shrink-0 border-b bg-background" />
  
  <!-- Windows/Linux -->
  <div v-else class="drag-region flex h-10 shrink-0 items-center justify-between border-b bg-background">
    <!-- Left: Icon + App Name -->
    <div class="no-drag flex items-center gap-2 pl-3">
      <svg class="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      <span class="text-xs font-medium text-muted-foreground select-none">ClawX</span>
    </div>

    <!-- Right: Window Controls -->
    <div class="no-drag flex h-full">
      <button
        @click="handleMinimize"
        class="flex h-full w-11 items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
        title="Minimize"
      >
        <Minus class="h-4 w-4" />
      </button>
      <button
        @click="handleMaximize"
        class="flex h-full w-11 items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
        :title="isMaximized ? 'Restore' : 'Maximize'"
      >
        <Copy v-if="isMaximized" class="h-3.5 w-3.5" />
        <Square v-else class="h-3.5 w-3.5" />
      </button>
      <button
        @click="handleClose"
        class="flex h-full w-11 items-center justify-center text-muted-foreground hover:bg-red-500 hover:text-white transition-colors"
        title="Close"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

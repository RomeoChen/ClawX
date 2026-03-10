<script setup lang="ts">
import { RouterView } from 'vue-router';
import TitleBar from './TitleBar.vue';
import Sidebar from './Sidebar.vue';
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-background">
    <TitleBar />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />
      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

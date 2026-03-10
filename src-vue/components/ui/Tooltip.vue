<script setup lang="ts">
import { NTooltip } from 'naive-ui';

defineProps<{
  content?: string;
}>();
</script>

<template>
  <NTooltip trigger="hover">
    <slot />
    <template #trigger>
      <span class="hidden">{{ content }}</span>
    </template>
    {{ content }}
  </NTooltip>
</template>

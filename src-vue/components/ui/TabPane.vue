<script setup lang="ts">
import { NTabPane } from 'naive-ui';

defineProps<{
  name: string;
  tab?: string;
}>();
</script>

<template>
  <NTabPane :name="name" :tab="tab">
    <slot />
  </NTabPane>
</template>

<script setup lang="ts">
import { NTabs } from 'naive-ui';

defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <NTabs
    :value="modelValue"
    type="line"
    class="w-full"
    @update:value="emit('update:modelValue', $event)"
  >
    <slot />
  </NTabs>
</template>

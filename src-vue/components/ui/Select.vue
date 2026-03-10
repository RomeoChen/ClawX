<script setup lang="ts">
import { NSelect } from 'naive-ui';

defineProps<{
  modelValue?: string | number | null;
  options: Array<{ label: string; value: string | number }>;
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null];
}>();
</script>

<template>
  <NSelect
    :value="modelValue"
    :options="options"
    :placeholder="placeholder"
    :disabled="disabled"
    class="w-full"
    @update:value="emit('update:modelValue', $event)"
  />
</template>

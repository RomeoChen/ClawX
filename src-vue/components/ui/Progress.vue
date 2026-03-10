<script setup lang="ts">
defineProps<{
  modelValue?: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();
</script>

<template>
  <div class="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
    <div
      class="h-full bg-primary transition-all"
      :style="{ width: `${modelValue ?? 0}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}>(), {
  variant: 'default',
});

const variantClasses = computed(() => {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  switch (props.variant) {
    case 'secondary':
      return `${base} border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80`;
    case 'destructive':
      return `${base} border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80`;
    case 'outline':
      return `${base} text-foreground`;
    case 'success':
      return `${base} border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100`;
    case 'warning':
      return `${base} border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100`;
    default:
      return `${base} border-transparent bg-primary text-primary-foreground hover:bg-primary/80`;
  }
});
</script>

<template>
  <span :class="variantClasses">
    <slot />
  </span>
</template>

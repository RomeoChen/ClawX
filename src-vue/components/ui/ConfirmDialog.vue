<script setup lang="ts">
import { NModal } from 'naive-ui';

defineProps<{
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <NModal
    :show="open"
    preset="dialog"
    :title="title"
    :positive-text="confirmLabel"
    :negative-text="cancelLabel"
    :type="variant === 'destructive' ? 'error' : 'warning'"
    @positive-click="emit('confirm')"
    @negative-click="emit('cancel')"
    @close="emit('cancel')"
  >
    <p class="text-sm text-muted-foreground">{{ message }}</p>
  </NModal>
</template>

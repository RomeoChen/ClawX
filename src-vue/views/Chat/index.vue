<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { NCard, NButton, NIcon, NInput, NSpin, NEmpty, NScrollbar } from 'naive-ui';
import { Send, Square, RefreshCw, Brain, Paperclip } from '@vicons/ionicons5';
import { useChatStore, type RawMessage } from '@/stores/chat';
import { useGatewayStore } from '@/stores/gateway';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const chatStore = useChatStore();
const gatewayStore = useGatewayStore();

const inputText = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const messages = computed(() => chatStore.messages);
const loading = computed(() => chatStore.loading);
const sending = computed(() => chatStore.sending);
const streamingText = computed(() => chatStore.streamingText);
const streamingTools = computed(() => chatStore.streamingTools);
const showThinking = computed(() => chatStore.showThinking);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleSend = async () => {
  if (!inputText.value.trim() || sending.value) return;
  const text = inputText.value.trim();
  inputText.value = '';
  await chatStore.sendMessage(text);
  await scrollToBottom();
};

const handleAbort = () => {
  chatStore.abortRun();
};

const formatTime = (timestamp?: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const getMessageContent = (message: RawMessage) => {
  if (typeof message.content === 'string') return message.content;
  if (Array.isArray(message.content)) {
    return message.content.map((block: any) => block.text || block.thinking || '').join('');
  }
  return JSON.stringify(message.content);
};

const getThinkingContent = (message: RawMessage) => {
  if (!message.content || !Array.isArray(message.content)) return null;
  const thinkingBlock = message.content.find((block: any) => block.type === 'thinking');
  return thinkingBlock?.thinking || null;
};

onMounted(async () => {
  await chatStore.loadHistory();
  await gatewayStore.init();
  await scrollToBottom();
});
</script>

<template>
  <div class="chat-page">
    <div class="chat-header">
      <h1>{{ t('chat.title', 'Chat') }}</h1>
      <div class="chat-actions">
        <NButton quaternary size="small" @click="chatStore.toggleThinking">
          <template #icon>
            <NIcon :component="Brain" />
          </template>
          {{ t('chat.thinking', 'Thinking') }}
        </NButton>
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <NSpin :show="loading">
        <NEmpty v-if="!loading && messages.length === 0" :description="t('chat.empty', 'No messages yet. Start a conversation!')" />
        
        <div v-else class="messages-list">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :class="{ 'message-user': message.role === 'user', 'message-assistant': message.role === 'assistant' }"
          >
            <div class="message-header">
              <span class="message-role">{{ message.role }}</span>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            
            <div v-if="message.role === 'assistant' && showThinking && getThinkingContent(message)" class="message-thinking">
              <NIcon :component="Brain" size="14" />
              {{ getThinkingContent(message) }}
            </div>
            
            <div class="message-content">
              {{ getMessageContent(message) }}
            </div>
            
            <div v-if="message.isError" class="message-error">
              {{ t('chat.error', 'Error') }}
            </div>
          </div>

          <div v-if="streamingText" class="message message-assistant">
            <div class="message-content streaming">
              {{ streamingText }}
              <span class="cursor">▊</span>
            </div>
          </div>
        </div>
      </NSpin>
    </div>

    <div v-if="streamingTools.length > 0" class="tools-status">
      <div v-for="tool in streamingTools" :key="tool.toolCallId" class="tool-status" :class="tool.status">
        <span class="tool-name">{{ tool.name }}</span>
        <span class="tool-status-text">{{ tool.status }}</span>
      </div>
    </div>

    <div class="chat-input">
      <NInput
        v-model:value="inputText"
        type="textarea"
        :placeholder="t('chat.placeholder', 'Type a message...')"
        :autosize="{ minRows: 1, maxRows: 6 }"
        :disabled="sending"
        @keydown.enter.exact.prevent="handleSend"
      />
      <div class="input-actions">
        <NButton
          v-if="sending"
          type="error"
          size="small"
          @click="handleAbort"
        >
          <template #icon>
            <NIcon :component="Square" />
          </template>
          {{ t('chat.stop', 'Stop') }}
        </NButton>
        <NButton
          v-else
          type="primary"
          size="small"
          :disabled="!inputText.trim()"
          @click="handleSend"
        >
          <template #icon>
            <NIcon :component="Send" />
          </template>
          {{ t('chat.send', 'Send') }}
        </NButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chat-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--n-color);
}

.message-user {
  background: var(--n-color);
  border: 1px solid var(--n-border-color);
}

.message-assistant {
  background: var(--n-color);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: var(--n-text-color-3);
}

.message-thinking {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  font-size: 0.875rem;
  color: #3b82f6;
  margin-bottom: 8px;
}

.message-content {
  font-size: 0.9375rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-content.streaming {
  color: var(--n-text-color-2);
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.message-error {
  margin-top: 8px;
  padding: 8px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
  color: #ef4444;
  font-size: 0.875rem;
}

.tools-status {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
}

.tool-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  background: var(--n-color);
  border: 1px solid var(--n-border-color);
}

.tool-status.running {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #3b82f6;
}

.tool-status.completed {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
  color: #22c55e;
}

.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 16px 0;
}

.chat-input .n-input {
  flex: 1;
}

.input-actions {
  display: flex;
  gap: 8px;
}
</style>

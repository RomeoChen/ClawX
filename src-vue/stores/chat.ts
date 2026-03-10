import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AttachedFileMeta {
  fileName: string;
  mimeType: string;
  fileSize: number;
  preview: string | null;
  filePath?: string;
}

export interface RawMessage {
  role: 'user' | 'assistant' | 'system' | 'toolresult';
  content: unknown;
  timestamp?: number;
  id?: string;
  toolCallId?: string;
  toolName?: string;
  details?: unknown;
  isError?: boolean;
  _attachedFiles?: AttachedFileMeta[];
}

export interface ContentBlock {
  type: 'text' | 'image' | 'thinking' | 'tool_use' | 'tool_result' | 'toolCall' | 'toolResult';
  text?: string;
  thinking?: string;
  source?: { type: string; media_type?: string; data?: string; url?: string };
  data?: string;
  mimeType?: string;
  id?: string;
  name?: string;
  input?: unknown;
  arguments?: unknown;
  content?: unknown;
}

export interface ChatSession {
  key: string;
  label?: string;
  displayName?: string;
  thinkingLevel?: string;
  model?: string;
}

export interface ToolStatus {
  id?: string;
  toolCallId?: string;
  name: string;
  status: 'running' | 'completed' | 'error';
  durationMs?: number;
  summary?: string;
  updatedAt: number;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<RawMessage[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const sending = ref(false);
  const activeRunId = ref<string | null>(null);
  const streamingText = ref('');
  const streamingTools = ref<ToolStatus[]>([]);
  const sessions = ref<ChatSession[]>([]);
  const currentSessionKey = ref('agent:main:main');
  const sessionLabels = ref<Record<string, string>>({});
  const sessionLastActivity = ref<Record<string, number>>({});
  const showThinking = ref(true);

  const currentMessages = computed(() => messages.value);

  const loadSessions = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('chat:sessions:list');
      if (result?.sessions) {
        sessions.value = result.sessions;
      }
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
  };

  const switchSession = async (key: string) => {
    currentSessionKey.value = key;
    await loadHistory();
  };

  const newSession = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('chat:session:create');
      if (result?.key) {
        currentSessionKey.value = result.key;
        messages.value = [];
        await loadSessions();
      }
    } catch (e) {
      console.error('Failed to create session:', e);
    }
  };

  const deleteSession = async (key: string) => {
    try {
      await window.electron.ipcRenderer.invoke('chat:session:delete', key);
      await loadSessions();
    } catch (e) {
      console.error('Failed to delete session:', e);
    }
  };

  const loadHistory = async (quiet = false) => {
    if (!quiet) loading.value = true;
    try {
      const result = await window.electron.ipcRenderer.invoke('chat:history', {
        sessionKey: currentSessionKey.value,
      });
      if (result?.messages) {
        messages.value = result.messages;
      }
    } catch (e) {
      console.error('Failed to load history:', e);
      error.value = String(e);
    } finally {
      loading.value = false;
    }
  };

  const sendMessage = async (text: string, attachments?: AttachedFileMeta[]) => {
    sending.value = true;
    error.value = null;
    try {
      await window.electron.ipcRenderer.invoke('chat:send', {
        message: text,
        sessionKey: currentSessionKey.value,
        attachments,
      });
    } catch (e) {
      error.value = String(e);
    } finally {
      sending.value = false;
    }
  };

  const abortRun = async () => {
    try {
      await window.electron.ipcRenderer.invoke('chat:abort');
    } catch (e) {
      console.error('Failed to abort:', e);
    }
  };

  const toggleThinking = () => {
    showThinking.value = !showThinking.value;
  };

  const clearError = () => {
    error.value = null;
  };

  // Listen for chat events
  if (typeof window !== 'undefined' && window.electron?.ipcRenderer) {
    window.electron.ipcRenderer.on('chat:event', (_event: unknown, data: Record<string, unknown>) => {
      handleChatEvent(data);
    });
  }

  const handleChatEvent = (event: Record<string, unknown>) => {
    const eventType = event.type as string;
    
    if (eventType === 'message' || eventType === 'message.delta') {
      const content = event.content as string;
      if (content) {
        streamingText.value += content;
      }
    } else if (eventType === 'message.final') {
      streamingText.value = '';
      loadHistory(true);
    } else if (eventType === 'tool.use') {
      const tool = event.tool as string;
      const toolId = event.toolCallId as string;
      streamingTools.value.push({
        toolCallId: toolId,
        name: tool,
        status: 'running',
        updatedAt: Date.now(),
      });
    } else if (eventType === 'tool.result') {
      const toolId = event.toolCallId as string;
      const idx = streamingTools.value.findIndex(t => t.toolCallId === toolId);
      if (idx >= 0) {
        streamingTools.value[idx].status = 'completed';
        streamingTools.value[idx].updatedAt = Date.now();
      }
    } else if (eventType === 'runstarted') {
      activeRunId.value = event.runId as string;
    } else if (eventType === 'runfinished' || eventType === 'runstopped') {
      activeRunId.value = null;
      streamingTools.value = [];
    } else if (eventType === 'error') {
      error.value = event.message as string;
      sending.value = false;
    }
  };

  return {
    messages,
    loading,
    error,
    sending,
    activeRunId,
    streamingText,
    streamingTools,
    sessions,
    currentSessionKey,
    sessionLabels,
    sessionLastActivity,
    showThinking,
    currentMessages,
    loadSessions,
    switchSession,
    newSession,
    deleteSession,
    loadHistory,
    sendMessage,
    abortRun,
    toggleThinking,
    clearError,
    handleChatEvent,
  };
});

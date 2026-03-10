import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    app: {
      title: 'ClawX'
    },
    nav: {
      dashboard: 'Dashboard',
      chat: 'Chat',
      channels: 'Channels',
      skills: 'Skills',
      cron: 'Scheduled Tasks',
      settings: 'Settings'
    },
    sidebar: {
      newChat: 'New Chat',
      dashboard: 'Dashboard',
      channels: 'Channels',
      skills: 'Skills',
      cronTasks: 'Cron Tasks',
      settings: 'Settings',
      devConsole: 'Dev Console',
      deleteSessionConfirm: 'Delete "{label}"?'
    },
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save',
      settings: 'Settings',
      next: 'Next',
      back: 'Back',
      start: 'Start',
      stop: 'Stop',
      actions: 'Actions'
    },
    dashboard: {
      title: 'Dashboard',
      gatewayStatus: 'Gateway',
      channels: 'Channels',
      skills: 'Skills',
      messages: 'Messages',
      quickActions: 'Quick Actions',
      newChatDesc: 'Start a new conversation',
      manageChannels: 'Manage communication channels',
      configureApp: 'Configure application settings'
    },
    chat: {
      title: 'Chat',
      empty: 'No messages yet. Start a conversation!',
      placeholder: 'Type a message...',
      send: 'Send',
      stop: 'Stop',
      thinking: 'Thinking',
      error: 'Error'
    },
    channels: {
      title: 'Channels',
      description: 'Manage your communication channels',
      empty: 'No channels available',
      enabled: 'Enabled',
      disabled: 'Disabled'
    },
    skills: {
      title: 'Skills',
      description: 'Manage AI skills and capabilities',
      empty: 'No skills available',
      enabled: 'Enabled',
      disabled: 'Disabled',
      builtin: 'Built-in'
    },
    cron: {
      title: 'Cron Tasks',
      description: 'Manage scheduled tasks',
      empty: 'No scheduled tasks',
      create: 'Create Task',
      createTask: 'Create Task',
      name: 'Name',
      schedule: 'Schedule',
      status: 'Status',
      lastRun: 'Last Run'
    },
    settings: {
      title: 'Settings',
      general: 'General',
      gateway: 'Gateway',
      proxy: 'Proxy',
      providers: 'AI Providers',
      theme: 'Theme',
      language: 'Language',
      gatewayAutoStart: 'Auto Start Gateway',
      gatewayPort: 'Gateway Port',
      gatewayStatus: 'Status',
      proxyEnabled: 'Enable Proxy',
      proxyServer: 'Proxy Server',
      proxyBypass: 'Bypass Rules'
    },
    setup: {
      welcome: 'Welcome',
      preferences: 'Preferences',
      complete: 'Complete',
      start: 'Start Using ClawX'
    }
  },
  'zh-CN': {
    app: {
      title: 'ClawX'
    },
    nav: {
      dashboard: '控制台',
      chat: '对话',
      channels: '渠道',
      skills: '技能',
      cron: '定时任务',
      settings: '设置'
    },
    sidebar: {
      newChat: '新对话',
      dashboard: '控制台',
      channels: '渠道',
      skills: '技能',
      cronTasks: '定时任务',
      settings: '设置',
      devConsole: '开发者控制台',
      deleteSessionConfirm: '删除 "{label}"？'
    },
    common: {
      confirm: '确认',
      cancel: '取消',
      delete: '删除',
      save: '保存',
      settings: '设置',
      next: '下一步',
      back: '返回',
      start: '启动',
      stop: '停止',
      actions: '操作'
    },
    dashboard: {
      title: '控制台',
      gatewayStatus: '网关',
      channels: '渠道',
      skills: '技能',
      messages: '消息',
      quickActions: '快捷操作',
      newChatDesc: '开始新对话',
      manageChannels: '管理通讯渠道',
      configureApp: '配置应用程序设置'
    },
    chat: {
      title: '对话',
      empty: '暂无消息，开始对话吧！',
      placeholder: '输入消息...',
      send: '发送',
      stop: '停止',
      thinking: '思考中',
      error: '错误'
    },
    channels: {
      title: '渠道',
      description: '管理您的通讯渠道',
      empty: '暂无渠道',
      enabled: '已启用',
      disabled: '已禁用'
    },
    skills: {
      title: '技能',
      description: '管理 AI 技能和能力',
      empty: '暂无技能',
      enabled: '已启用',
      disabled: '已禁用',
      builtin: '内置'
    },
    cron: {
      title: '定时任务',
      description: '管理定时任务',
      empty: '暂无定时任务',
      create: '创建任务',
      createTask: '创建任务',
      name: '名称',
      schedule: '计划',
      status: '状态',
      lastRun: '上次运行'
    },
    settings: {
      title: '设置',
      general: '通用',
      gateway: '网关',
      proxy: '代理',
      providers: 'AI 提供商',
      theme: '主题',
      language: '语言',
      gatewayAutoStart: '自动启动网关',
      gatewayPort: '网关端口',
      gatewayStatus: '状态',
      proxyEnabled: '启用代理',
      proxyServer: '代理服务器',
      proxyBypass: '绕过规则'
    },
    setup: {
      welcome: '欢迎',
      preferences: '偏好设置',
      complete: '完成',
      start: '开始使用 ClawX'
    }
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages
});

export default i18n;

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

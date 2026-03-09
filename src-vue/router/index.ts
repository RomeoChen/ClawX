import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/views/Setup/index.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/index.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat/index.vue')
  },
  {
    path: '/channels',
    name: 'Channels',
    component: () => import('@/views/Channels/index.vue')
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('@/views/Skills/index.vue')
  },
  {
    path: '/cron',
    name: 'Cron',
    component: () => import('@/views/Cron/index.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/index.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

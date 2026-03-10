import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Chat',
        component: () => import('@/views/Chat/index.vue')
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue')
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
    ]
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/views/Setup/index.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '../views/ChatView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // @ts-ignore
      component: ChatView,
      beforeEnter() {
        if (!localStorage.getItem('username')) router.push('/login');
      },
    },
    {
      path: '/login',
      name: 'LoginView',
      component: () => import('../views/LoginView.vue'),
    },
  ],
});

export default router;

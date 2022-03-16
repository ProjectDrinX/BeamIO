import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '../views/Chat.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // @ts-ignore
      component: ChatView,
      beforeEnter() {
        if (!localStorage.getItem('username')) router.push('/setUsername');
      },
    },
    {
      path: '/setUsername',
      name: 'setUsername',
      component: () => import('../views/SetUsername.vue'),
    },
  ],
});

export default router;

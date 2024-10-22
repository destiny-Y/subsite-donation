import { useAppStore } from '@/store';
import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/home.vue')
  },
  {
    path: '/newsPage',
    name: 'newsPage',
    component: () => import('@/views/newsPage/newsPage.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/detail.vue')
  },
  {
    path: '/humanisticCare',
    name: 'humanisticCare',
    component: () => import('@/views/humanisticCare/humanisticCare.vue')
  },
  {
    path: '/commemoration',
    name: 'commemoration',
    component: () => import('@/views/commemoration/commemoration.vue')
  }
];
const router = createRouter({
  // history: createWebHistory(),
  history: createWebHistory("/donationSite/"),  // histroy 模式下需要配置部署目录名
  scrollBehavior: () => {
    return {
      top: 0
    };
  },
  routes
});
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  if (to.fullPath == '/home') {
    store.updateState({ parentNavCurrentIndex: 0 });
  }
  next();
});
export default router;

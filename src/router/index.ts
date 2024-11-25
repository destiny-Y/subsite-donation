import { useAppStore } from '@/store';
// import { monitor } from '@/utils/checkUpdate';
// import { ElMessageBox } from 'element-plus';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
const routes = [
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: () => import('@/views/home/home.vue')
  // },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/',
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
  },
  {
    path:"/infoedit",
    name: 'infoedit',
    component: () => import('@/views/infoEdit/infoEdit.vue')
  }
];
const router = createRouter({
  // history: createWebHistory(),
  history: createWebHistory("/donationSite/"),  // histroy 模式下需要配置部署目录名
  // history:createWebHashHistory("/donationSite/"),
  scrollBehavior: () => {
    return {
      top: 0
    };
  },
  routes
});
// 监听是否有更新
// monitor.on("update",() => {
//   console.log("有更新");
  
//   ElMessageBox.confirm("版本有更新，是否刷新页面","更新提示",{
//     confirmButtonText: '刷新',
//     cancelButtonText: '不刷新',
//     type: 'success',
//   }).then(() => {
//     // 更新操作
//     location.reload();
//   }).catch(() => {
//     monitor.pause();
//   })
// })
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  if (to.fullPath == '/home') {
    store.updateState({ parentNavCurrentIndex: 0 });
  }
  // monitor.check();
  next();
});
export default router;

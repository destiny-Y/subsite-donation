import './assets/css/reset.css';
import './assets/css/base.less';
import './assets/css/style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import * as ElementPlusIcons from '@element-plus/icons-vue';
import datav from '@iamzzg/data-view/dist/vue3/datav.map.vue.esm';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import vue3videoPlay from 'vue3-video-play'; // 引入组件
import 'vue3-video-play/dist/style.css'; // 引入css

const app = createApp(App);
Object.keys(ElementPlusIcons).forEach((iconName) => {
  app.component(iconName, ElementPlusIcons[iconName as keyof typeof ElementPlusIcons]);
});
if (process.env.NODE_ENV !== 'development') {
  document.onkeydown = (event) => {
    // 禁用F12
    if (event && event.keyCode == 123) {
      return false;
      // 禁用ctrl + shift + i
    } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
      //屏蔽Shift+F10
    } else if (event.shiftKey && event.keyCode == 121) {
      return false;
    }
  };
  // 禁用鼠标右键
  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });
  document.oncontextmenu = (event) => {
    event.preventDefault();
    return false;
  };
  document.onselectstart = (event) => {
    event.preventDefault();
    return false;
  };
}
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia).use(router).use(vue3videoPlay).use(datav).use(ElementPlus, {
  locale: zhCn
});
app.mount('#app');

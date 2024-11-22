<template>
  <div class="crumb">
    <div class="container">
      <span>位置导航：</span>
      <p @click="goHome">首页</p>
      >>
      <p @click="goBackParentNav">{{ breadCrumbInfo.parentName }}</p>
      >>
      <template v-if="breadCrumbInfo.childName">
        <p @click="goBackChildNav">{{ breadCrumbInfo.childName }}</p>
      </template>
      <template v-if="breadCrumbInfo.articleName">
        >>
        <p class="title">{{ breadCrumbInfo.articleName }}</p>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { IObject } from '@/types/interface';
import { useAppStore } from '@/store';
const router = useRouter();
const store = useAppStore();
const breadCrumbInfo = ref<IObject>(store.state.navigationInfo);
watch(
  () => store.state.navigationInfo,
  (newValue) => {
    if (newValue) {
      breadCrumbInfo.value = { ...store.state.navigationInfo };
    }
  }
);
/**
 * 返回首页
 */
const goHome = () => {
  router.push({
    path: '/home'
  });
};
/**
 * 返回一级栏目
 */
 const goBackParentNav = () => {
  breadCrumbInfo.value.articleTitle = '';
  breadCrumbInfo.value.childId = store.state.menus[store.state.parentNavCurrentIndex]?.children?.length > 0 ? store.state.menus[store.state.parentNavCurrentIndex]?.children[0]?.id : '';
  breadCrumbInfo.value.childName = store.state.menus[store.state.parentNavCurrentIndex]?.children?.length > 0 ? store.state.menus[store.state.parentNavCurrentIndex]?.children[0]?.channelName : '';
  store.updateState({
    navigationInfo: breadCrumbInfo.value,
    childNavCurrentIndex: 0
  });
  router.push({
    path: '/newsPage'
  });
};
/**
 * 二级栏目
 */
const goBackChildNav = () => {
  // 点击的二级栏目未人文关怀下的缅怀纪念遗体（角膜）捐献者或者缅怀纪念人体器官捐献者，不进行页面跳转
  if(breadCrumbInfo.value.childId == "1817803512172523521" || breadCrumbInfo.value.childId == "1817803590371127297"){
    return 
  }
  breadCrumbInfo.value.articleTitle = '';
  store.updateState({
    navigationInfo: breadCrumbInfo.value
  });
  router.push({
    path: '/newsPage'
  });
};
</script>
<style lang="less" scoped>
.crumb {
  height: 60px;
  line-height: 60px;
  background: #F2FAFE;
  .container {
    width: @base-width;
    color: rgba(0, 0, 0, 0.4);
    margin: 0 auto;
    p {
      display: inline-block;
      cursor: pointer;
    }
    p:hover {
      color: @base-nav-bg-color;
    }
    .title {
      cursor: auto;
    }
    .title:hover {
      color: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>

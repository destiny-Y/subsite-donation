<template>
  <div class="header">
    <div class="logo-box">
      <!-- <div class="logo">
        <img v-if="!logo" src="../../assets/images/logo.png" />
        <img v-else :src="logo" />
      </div> -->
      <div class="logo logo-wrapper">
        <img class="logo-icon" src="../../assets/images/header-icon.png" alt="">
        <p class="logo-title">重庆市红十字会</p>
        <div class="title">
          <p class="title-top">重庆市遗体器官捐献管理中心</p>
          <p>重庆市造血干细胞捐献者资料库管理中心</p>
        </div>
      </div>
    </div>
    <div class="nav-box">
      <base-nav :nav-list="headerNavLit" :isHeaderNav="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import BaseNav from '../base-nav/index.vue';
import { useAppStore } from '@/store';
const store = useAppStore();
const headerNavLit = ref([]);
const logo = ref<any>(store.state.logoUrl);
watch(
  () => store.state.menus,
  (newValue) => {
    if (newValue) {
      headerNavLit.value = store.state.menus;
    }
  }
);
watch(
  () => store.state.logoUrl,
  (newValue) => {
    if (newValue) {
      logo.value = store.state.logoUrl;
    }
  }
);
</script>

<style lang="less" scoped>
.header {
  position: relative;
  .logo-box {
    height: 140px;
    background-color: #19C2D1;
    padding-top: 37px;
    .logo-wrapper {
      width: 1062px;
      display: flex;
      align-items: center;
      color: #fff;
      margin: 0 auto;
      .logo-icon {
        width: 240px;
        height: @logo-img-height;
      }
      .logo-title {
        box-sizing: border-box;
        margin: auto 30px;
        font-size: 36px;
        font-weight: 600;
        letter-spacing: 2px;
      }
      .title {
        width: 473px;
        font-size: 24px;
        letter-spacing: 1.7px;
        .title-top {
          margin-bottom: 6px;
          letter-spacing: 12.3px;
        }
      }
    }
  }
  .nav-box {
    width: 100%;
    background: @base-nav-bg-color;
  }
}
</style>

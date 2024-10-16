<template>
  <Layout />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store';
import Layout from './layout/index.vue';
useAppStore().initApp();
</script>
<style lang="less">
  #app{
    min-width: 1200px;
  }
</style>

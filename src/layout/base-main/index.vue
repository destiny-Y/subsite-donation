<template>
  <div class="main">
    <RouterView />
  </div>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router';
</script>
<style lang="less" scoped>
.main {
  // min-height: calc(100vh - @base-nav-height - @base-nav-height - @base-footer-height - @logo-box-height);
  min-height: @base-mian-height;
  min-width: 1200px;
  overflow: hidden;
  // background: @base-bg-color;
}
</style>

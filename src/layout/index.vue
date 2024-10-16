<template>
  <el-container>
    <tool-nav/>
    <el-header>
      <base-header />
    </el-header>
    <el-main>
      <base-main />
    </el-main>
    <el-footer>
      <base-footer />
    </el-footer>
  </el-container>
  <div class="gif_container" v-if="visible">
    <div class="mask"></div>
    <img src="../assets/images/message.gif" alt="">
  </div>
</template>
<script lang="ts" setup>
import BaseHeader from './base-header/index.vue';
import BaseMain from './base-main/index.vue';
import BaseFooter from './base-footer/index.vue';
import ToolNav from '@/components/tool/index.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import Emits from "@/utils/emits";

const visible = ref(false);
const start = () => {
  visible.value = true;
};
const close = () => {
  setTimeout(() => {
    visible.value = false;
  },2200)
}
onMounted(() => {
  Emits.on("startGif",() => {
    start();
  });
  Emits.on("closeGif",() => {
    close();
  });
});
onUnmounted(() => {
  Emits.off("startGif");
  Emits.off("closeGif");
})
</script>
<style lang="less" scoped>
:deep(.el-main),
:deep(.el-header),
:deep(.el-footer) {
  padding: 0 !important;
}
:deep(.el-header),
:deep(.el-footer) {
  height: auto !important;
}
// gif样式
.gif_container{
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  .mask{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3)
  }
  img{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>

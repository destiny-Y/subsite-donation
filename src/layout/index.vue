<template>
  <el-container>
    <tool-nav/>
    <el-header>
      <base-header />
    </el-header>
    <el-main style="width: 100%;">
      <base-main />
    </el-main>
    <el-footer>
      <base-footer />
    </el-footer>
  </el-container>
  <!-- gif动效 -->
  <div class="gif_container" v-if="visible">
    <div class="mask"></div>
    <img src="../assets/images/message.gif" alt="">
  </div>
  <!-- 博爱山城小程序二维码 -->
  <el-dialog v-model="codeVisible" style="border-radius: 15px;text-align: center;" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" destroy-on-close>
    <template #header="{ titleId, titleClass }">
      <div class="my_header">
        <p :id="titleId" :class="titleClass">扫描下方二维码进入小程序</p>
      </div>
    </template>
    <!-- <img style="width: 300px;" src="../assets/images/2.jpg" alt=""> -->
    <img style="width: 300px;" src="../assets/images/3.png" alt="">
  </el-dialog>
</template>
<script lang="ts" setup>
import BaseHeader from './base-header/index.vue';
import BaseMain from './base-main/index.vue';
import BaseFooter from './base-footer/index.vue';
import ToolNav from '@/components/tool/index.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import Emits from "@/utils/emits";
import baseService from '@/service/baseService';

const visible = ref(false);
const codeVisible = ref(false);
const start = () => {
  visible.value = true;
};
const close = () => {
  setTimeout(() => {
    visible.value = false;
  },2200)
};
// 
const registerQuery = () => {
  codeVisible.value = true;
}
onMounted(() => {
  Emits.on("startGif",() => {
    start();
  });
  Emits.on("closeGif",() => {
    close();
  });
  Emits.on("registerQuery",() => {
    registerQuery();
  })
});
onUnmounted(() => {
  Emits.off("startGif");
  Emits.off("closeGif");
  Emits.off("registerQuery");
  Emits.off("updateBreadCrumb");
})
</script>
<style lang="less" scoped>
.my_header{
  text-align: left;
  padding-top: 10px;
}
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

<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px">
    <div class="tips">
      <div class="w-e-text-container">
        <!-- 给span元素添加点击事件 -->
        <span @click="toPopLink" class="content" v-html="state.content" data-slate-editor></span>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
const visible = ref(false);
const state = reactive({
  content: "",
});
const init = (content?: string) => {
  visible.value = true;
  if (content) {
    state.content = content;
  }
};

// 点击弹窗内容(图片)跳转至指定链接
const toPopLink = ($event: any) => {
  let imgEl = $event.target;
  // 通过事件触发对象来获取img元素，拿到data-href的值，并进行跳转
  if (imgEl.nodeName.toLowerCase() == "img") {
    let url = imgEl.dataset.href;
    // 链接地址值不为空才进行跳转
    url && window.open(url);
  }
};
defineExpose({
  init,
});
</script>
<style lang="less" scoped></style>

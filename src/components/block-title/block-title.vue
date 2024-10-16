<template>
  <div class="title-box">
    <div class="title active" v-if="isString">{{ titles }}</div>
    <template v-else>
      <div>
        <span v-for="(title, index) in titles" :key="index" class="title" :class="{ active: tabCurrentIndex == index, 'tem-color': tabCurrentIndex != index }" @click="tabClick(index)">{{ title }}</span>
      </div>
    </template>
    <div class="right-btn cursor" v-if="isShowMore" @click.stop="lockMoreNews">
      <img class="btn-img" src="../../assets/images/smallicon.png" />
      <span>更多</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['lockMoreNews', 'tabClick']);
const props = defineProps({
  titles: {
    type: String || Array,
    default() {
      return '';
    }
  },
  isShowMore: {
    type: Boolean,
    default: false
  }
});
const isString = typeof props.titles === 'string';
const tabCurrentIndex = ref(0);
const lockMoreNews = (data?: any) => {
  emit('lockMoreNews');
};
const tabClick = (index: number) => {
  tabCurrentIndex.value = index;
  emit('tabClick', index);
};
</script>
<style lang="less" scoped>
.title-box {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  font-size: @base-font-size20;
  font-weight: @base-font-weight;
  line-height: 26px;
  border-bottom: 2px solid @base-nav-bg-color;
  .title {
    position: relative;
    cursor: pointer;
    color: @base-nav-bg-color;
    margin-right: 32px;
  }
  .tem-color {
    color: @base-color;
  }
  .active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: 50%;
    border-color: transparent transparent #e89210;
    border-style: solid;
    border-width: 0 4px 7px;
  }
  .right-btn {
    .btn-img {
      height: 14px;
      width: 14px;
      margin-right: 4px;
    }
    span {
      font-size: @base-font-size16;
    }
  }
}
</style>

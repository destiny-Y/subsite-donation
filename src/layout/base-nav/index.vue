<template>
  <div class="nav-main">
    <template v-if="isHeaderNav">
      <template v-for="(item, index) in props.navList" :key="item.id">
        <div v-if="item.isHide != 1" class="nav-item cursor" @click="navRouterHandle(item.id, index)">
          <div :class="{ line: index != props.navList.length - 1, active: currentIndex == index }">{{ item.channelName }}</div>
          <div class="sub-nav-box" v-if="item.children.length > 0">
            <div class="sub-nav-item" v-for="(children, childIndex) in item.children" :key="children.id" :data-parentIndex="index" @click.stop="subNavRouterHandle($event, children.id, children.channelName, childIndex)">{{ children.channelName }}</div>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="nav-item cursor" v-for="(item, index) in props.navList" :key="index">
        <div :class="{ line: index != props.navList.length - 1 }">{{ item.dictLabel }}</div>
        <div class="sub-nav-box bottom-nav-box">
          <div class="bottom-container">
            <a class="bottom-nav-item" v-for="children in item.children" :key="children.linkTitle" :href="children.linkUrl" target="_blank">{{ children.linkTitle }}</a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store';
import Emits from "@/utils/emits";
const router = useRouter();
const store = useAppStore();
const props = defineProps({
  navList: {
    type: Array as any,
    default() {
      return [];
    }
  },
  isHeaderNav: {
    type: Boolean,
    default() {
      return true;
    }
  }
});
/**
 * 记录当前点击的父栏目
 */
const currentIndex = ref<number>(0);
watch(
  () => store.state.parentNavCurrentIndex,
  (newValue) => {
    currentIndex.value = newValue;
  }
);
onMounted(() => {
  const baseInfo = JSON.parse(localStorage.getItem('baseInfo') as any);
  if (typeof baseInfo !== 'undefined') {
    currentIndex.value = baseInfo?.state.parentNavCurrentIndex;
  }
});
/**
 * 父级栏目点击
 */
const navRouterHandle = (id?: number | string, index?: any) => {
  // 登记查询栏目无跳转页面
  if(id == "1817740827699490817"){
    return;
  }
  currentIndex.value = index;
  store.updateState({
    navigationInfo:
      id != 1
        ? {
            parentName: props.navList[index].channelName,
            parentId: props.navList[index].id,
            childName: props.navList[index].children.length > 0 ? props.navList[index].children[0].channelName : '',
            childId: props.navList[index].children.length > 0 ? props.navList[index].children[0].id : ''
          }
        : {},
    parentNavCurrentIndex: currentIndex.value,
    childNavCurrentIndex: 0
  });
  router.push({
    path: id == 1 ? '/home' : '/newsPage'
  });
};
/**
 * 子栏目点击
 */
const subNavRouterHandle = (e: any, childId?: number | string, childName?: string, childIndex?: number) => {
  // 登记查询栏目二级栏目特殊处理
  if(childId == "1817757218112581633" || childId == "1817803244789837826"){
    // 展示遮罩层
    Emits.emit("registerQuery");
    return
  }else if(childId == "1817757312123711490"){  // 人体器官捐献栏目跳转至中国人体器官捐献管理中心
    window.open("https://register.codac.org.cn/");
    return 
  }else if(childId == "1817803321692401665"){  // 无偿献血栏目调整至重庆血液中心
    window.open("https://www.ccbc.org.cn/")
    return 
  }
  const {
    target: {
      dataset: { parentindex }
    }
  } = e;
  store.updateState({
    navigationInfo: {
      parentName: props.navList[parentindex].channelName,
      parentId: props.navList[parentindex].id,
      childName: childName,
      childId: childId
    },
    parentNavCurrentIndex: parentindex,
    childNavCurrentIndex: childIndex
  });
  // 人文关怀栏目特殊处理
  if(childId == "1817803512172523521"){  // 人体器官捐献者
    router.push({
      path: '/humanisticCare',
      query: {
        name:2
      }
    });
    return
  }else if(childId == "1817803590371127297"){  // 遗体(角膜)捐献者
    router.push({
      path: '/humanisticCare',
      query: {
        name:1
      }
    });
    return
  }
  router.push({
    path: props.navList[parentindex].id == 1 ? '/home' : '/newsPage'
  });
};
</script>

<style lang="less" scoped>
.nav-main {
  width: @base-width;
  // width: auto;
  height: @base-nav-height;
  line-height: @base-nav-height;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  .nav-item {
    flex: 1;
    // width: 220px;
    // flex-shrink: 0;
    font-size: @base-font-size20;
    font-weight: @base-font-weight;
    color: @base-white-color;
    overflow: hidden;
    .line,
    .active {
      position: relative;
    }
    .line::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      height: 24px;
      width: 1px;
      background: @base-white-color;
    }
    .active::before {
      content: '';
      position: absolute;
      display: block;
      left: 50%;
      bottom: 5px;
      transform: translateX(-50%);
      border-color: transparent transparent #fff;
      border-style: solid;
      border-width: 0 5px 5px;
      z-index: 999;
    }
    .sub-nav-box {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(@logo-box-height + @base-nav-height);
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      align-items: center;
      transition: all 0.5s;
      // background: rgba(255, 255, 255, 0.85);
      background-color: rgba( 12,163,186,.5);
      // background-color: @base-nav-bg-color;
      // opacity: 0.5;
      z-index: 999;
      overflow: hidden;
      .sub-nav-item {
        height: 0;
        line-height: @base-sub-nav-height;
        padding: 0 15px;
        font-size: @base-font-size16;
        font-weight: @base-font-weight;
        color: #fff;
        transition: all 0.5s;
      }
      .sub-nav-item:hover {
        color: @base-nav-bg-color;
      }
    }
    .bottom-nav-box {
      top: unset;
      bottom: calc(@base-nav-height + @base-footer-height);
      text-align: left;
      // background: rgba(2, 0, 0, 0.3);
      // background: @base-white-color;
      background-color: #e5e5e5;
      .bottom-container {
        width: @base-width;
        min-height: 0;
        height: 0;
        margin: 0 auto;
        // transition: all 0.5s;
        line-height: normal;
        .bottom-nav-item {
          display: inline-block;
          padding: 10px;
          font-size: @base-font-size16;
          font-weight: 400;
          color: @base-color;
        }
        .bottom-nav-item:hover {
          color: @base-nav-bg-color;
        }
      }
    }
  }
  .nav-item:hover {
    .sub-nav-box {
      .sub-nav-item {
        height: @base-sub-nav-height;
      }
    }
    .bottom-nav-box {
      .bottom-container {
        min-height: 70px;
        height: auto;
      }
    }
  }
}
</style>

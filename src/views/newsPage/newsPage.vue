<template>
  <div class="news-page">
    <bread-crumb />
    <div class="container">
      <div class="left-sub-nav">
        <div class="left-sub-nav-header">{{ navigationInfo.parentName }}</div>
        <div class="left-sub-nav-item" :class="{ active: navigationInfo.childId == item.id }" v-for="(item, index) in childNavList" :key="item.id" 
        @click="subNavHandle(item.id, item.channelName, index)">{{ item.channelName }}</div>
      </div>
      <div class="right-main">
        <div class="right-main-header">{{ navigationInfo.parentName }}</div>
        <div class="right-main-list">
          <div class="right-main-row" v-for="article in articleList" :key="article.articleId" @click="lockDetailHandle(article.title, article.articleId)">
            <p>{{ article.title }}</p>
            <p>{{ article.date }}</p>
          </div>
        </div>
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :page-size="state.limit" :total="state.total" :current-page="state.page" @current-change="pageCurrentChangeHandle" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { IObject } from '@/types/interface';
import BreadCrumb from '@/components/bread-crumb/bread-crumb.vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store';
import baseService from '@/service/baseService';
const router = useRouter();
const store = useAppStore();
const state = reactive({
  page: 1,
  limit: 15,
  total: 0
});
const articleList = ref<any>([]); //文章列表
const childNavList = ref<any>(); //子菜单列表
const navigationInfo = ref<IObject>({});
watch(
  () => store.state.navigationInfo,
  (newValue) => {
    if (newValue) {
      navigationInfo.value = newValue;
    }
  }
);
watch(
  () => store.state.parentNavCurrentIndex,
  (newValue) => {
    if (newValue) {
      childNavList.value = store.state.menus[newValue].children;
      state.page = 1;
      getArticleList();
    }
  }
);
watch(
  () => store.state.childNavCurrentIndex,
  (newValue) => {
    if (typeof newValue != 'undefined') {
      state.page = 1;
      getArticleList();
    }
  }
);
onMounted(() => {
  navigationInfo.value = store.state.navigationInfo;
  childNavList.value = store.state.menus[store.state.parentNavCurrentIndex]?.children;
  getArticleList();
});
const getArticleList = () => {
  baseService.get('/view/wsarticleView/page', { page: state.page, limit: state.limit, channelId: navigationInfo.value.childId }).then((res) => {
    articleList.value = [...res.data.list];
    state.total = res.data.total;
  });
};
/**
 * 查看详情
 */
const lockDetailHandle = (articleTitle: string, articleId: string) => {
  router.push({
    path: '/detail',
    query: {
      articleId,
      channelId: navigationInfo.value.childId
    }
  });
};
/**
 * 二级栏目切换
 */
const subNavHandle = (id?: number | string, name?: string, index?: number) => {
  // console.log(111);
  
  let navigationInfo = { ...store.state.navigationInfo };
  navigationInfo.childId = id;
  navigationInfo.childName = name;
  state.page = 1;
  articleList.value = [];
  // 特殊处理人文关怀下子栏目
  if(id == "1817803512172523521"){  // 人体器官捐献者
    router.push({
      path: '/humanisticCare',
      query: {
        name:2
      }
    });
    return
  }else if(id == "1817803590371127297"){  // 遗体(角膜)捐献者
    router.push({
      path: '/humanisticCare',
      query: {
        name:1
      }
    });
    return
  }else{
    if (store.state.childNavCurrentIndex == index) {    
      getArticleList();
    }
  }
  store.updateState({
    navigationInfo,
    childNavCurrentIndex: index
  });
  
};
/**
 * 分页, 当前页
 */
const pageCurrentChangeHandle = (val: number) => {
  state.page = val;
  getArticleList();
};
</script>
<style lang="less" scoped>
.news-page {
  background: @base-white-color;
  .container {
    min-height: @base-mian-height;
    width: @base-width;
    padding: 24px 0 30px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    .left-sub-nav {
      width: 300px;
      & > div {
        height: 58px;
        font-size: 15px;
        color: @base-color;
        text-align: center;
        line-height: 20px;
        background-color: #f8f8f8;
      }
      & > div:first-child {
        font-size: 20px;
        color: @base-white-color;
      }
      .left-sub-nav-header {
        background: @base-nav-bg-color;
        line-height: 58px;
      }
      .left-sub-nav-item {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0 5px;
      }
      .left-sub-nav-item:hover {
        text-decoration: underline;
      }
      .left-sub-nav-item:hover,
      .active {
        color: @base-nav-bg-color;
      }
    }
    .right-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-left: 40px;
      .right-main-header,
      .right-main-row {
        border-bottom: 1px solid #eeeeee;
      }
      .right-main-list {
        flex: 1;
      }
      .right-main-header {
        line-height: 58px;
        font-size: 26px;
      }
      .right-main-row {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        line-height: 76px;
        p {
          font-size: @base-font-size16;
        }
        p:first-child {
          width: 700px;
          padding-left: 30px;
          background: url('../../assets/images/arrow.png') left center / 18px 18px no-repeat;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          cursor: pointer;
        }
        p:first-child:hover {
          color: @base-nav-bg-color;
          text-decoration: underline;
        }
        p:last-child {
          color: rgba(0, 0, 0, 0.4);
        }
      }
      .pagination {
        align-self: flex-end;
        margin-top: 20px;
        :deep(.el-pagination.is-background) .el-pager li:not(.is-disabled).is-active {
          background-color: @base-nav-bg-color;
          color: @base-white-color;
        }

        :deep(.el-pagination.is-background) .el-pager li:not(.is-disabled).is-active:hover {
          color: @base-white-color !important;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

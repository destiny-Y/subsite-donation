<template>
  <div class="home">
    <bread-crumb />
    <div class="main">
      <div class="news-box">
        <div class="news-title borderBottom">
          <p>{{ state.articleInfo.nowArticleViewDTO?.articleTitle }}</p>
          <p>
            <span>时间：{{ state.articleInfo.nowArticleViewDTO?.articleReleaseDate.split(" ")[0] }}</span>
            <span>作者：{{ state.articleInfo.nowArticleViewDTO?.articleAuthor }}</span>
          </p>
        </div>
        <div class="content borderBottom" :style="{'text-align': state.articleInfo.nowArticleViewDTO?.articleChannelType != 1 ? 'center' : 'left','padding-top': '20px',}">
          <!-- articleChannelType 栏目类型  1为救助项目栏目文章 -->
          <template v-if="state.articleInfo.nowArticleViewDTO?.articleChannelType != 1">
            <!-- 图文类型文章 -->
            <template v-if="state.articleInfo.nowArticleViewDTO?.articleType == 1">
              <!-- 总会对接生成的数据 -->
              <div class="wrapper" v-if="state.articleInfo.nowArticleViewDTO?.datasource == 5">
                <!-- 名誉会长 -->
                <div class="leader" v-if="state.type == 2">
                  <h1 class="duty">{{ state.leaderInfo.duty || "" }}</h1>
                  <img class="leader_photo" :src="state.leaderInfo.profilePhoto" alt="">
                  <p class="leader_name">{{ state.leaderInfo.name }}</p>
                  <p class="org_content">{{ state.leaderInfo.introduction }}</p>
                </div>
                 <!-- 理事会、内设机构 -->
                <div class="council" v-else-if="state.type == 3 || state.type == 4">
                  <p class="org_title">{{ state.articleIntroduce }}</p>
                  <p class="org_content">{{ state.council }}</p>
                </div>
                <!-- 直属单位 -->
                <div v-else-if="state.type == 5" class="unit">
                  <p>
                    <pre class="unit_detail">{{ state.council }}</pre>
                  </p>
                </div>
                <!-- 公示文件 -->
                <div v-else-if="state.type == 6" class="file_list">
                  <a style="color: #e50516;" target="_blank" v-for="(item,index) in state.fileList" :href="item" :key="item">{{ state.fileTitle + "（" + (index+1) +"）" }}</a>
                </div>
                <!-- 公开募捐资格证 -->
                 <div class="donation" v-else-if="state.type == 7">
                  <p class="donation_dept">{{store.state.sites.name}}</p>
                  <p>是否具有公开募捐资格：{{ state.donationInfo.donateQualification == '0' ? '是' : '否' }}</p>
                  <p class="donation_cert">
                    <span class="cert_title">公开募捐资格证书：</span>
                    <img :src="state.donationInfo.attachmentLink" alt="">
                  </p>
                  <p class="donation_cert">是否取得公益性捐赠税前扣除资格：{{ state.donationInfo.dutyFree == '0' ? '是' : '否' }}</p>
                  <p>最近一次获得资格日期：{{ state.donationInfo.latestDate }}</p>
                  <p>有效期开始年份：{{ state.donationInfo.beginYear }}</p>
                  <p>有效期结束年份：{{state.donationInfo.endYear}}</p>
                  <p>批准文件名称：{{state.donationInfo.fileName}}</p>
                  <p>文号：{{ state.donationInfo.referenceNumber }}</p>
                  <a class="donation_material" :href="state.donationInfo.supportingMaterial" target="_blank">佐证材料</a>
                 </div>
              </div>
              <!-- 内容发布的数据 -->
              <div class="w-e-text-container" v-else>
                <span v-html="state.articleInfo.nowArticleViewDTO?.articleContent" data-slate-editor></span>
              </div>
            </template>
            <!-- 视频类型文章 -->
            <template v-if="state.articleInfo.nowArticleViewDTO?.articleType == 2">
              <video v-if="state.isShowFlvPlayer" id="videoElement" ref="videoElementRef" crossOrigin="anonymous" controls muted width="100%" height="600px"></video>
              <vue3VideoPlay v-else width="100%" height="600px" :title="state.articleInfo.nowArticleViewDTO?.articleTitle"
                color="#0e5f6d" :src="state.articleInfo.nowArticleViewDTO?.articleVideoUrl" />
            </template>
          </template>
          <template v-else>
            <el-tabs v-model="state.activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="项目介绍" name="project">
                <div v-if="state.activeName == 'project'" class="w-e-text-container">
                  <span v-html="state.articleInfo.nowArticleViewDTO?.articleContent" data-slate-editor></span>
                </div>
              </el-tab-pane>
              <el-tab-pane label="发起方介绍" name="introduce">
                <div v-if="state.activeName == 'introduce'" class="w-e-text-container">
                  <span v-html="state.articleInfo.nowArticleViewDTO?.articleIntroduce" data-slate-editor></span>
                </div>
              </el-tab-pane>
              <el-tab-pane label="捐赠回馈" name="donationFeedback">
                <div v-if="state.activeName == 'donationFeedback'" class="w-e-text-container">
                  <span v-html="state.articleInfo.nowArticleViewDTO?.articleDonationFeedback" data-slate-editor></span>
                </div>
              </el-tab-pane>
              <el-tab-pane label="捐款记录" name="donationRecords">
                <div v-if="state.activeName == 'donationRecords'" class="w-e-text-container">
                  <span v-html="state.articleInfo.nowArticleViewDTO?.articleDonationRecords" data-slate-editor></span>
                </div>
              </el-tab-pane>
            </el-tabs>
          </template>
          <div class="file" v-for="item in state.articleInfo?.nowArticleViewDTO?.articleAnnexFileInfo" :key="item">
            <a style="color: #e50516;" :href="item.url" :download="item.fileOriginalName">{{ item.fileOriginalName }}</a>
          </div>
        </div>
        <div class="news-bottom">
          <p>
            上一篇：
            <span v-if="state.articleInfo.lastArticleViewDTO == null">暂无上一条</span>
            <span class="boot_tit" v-else @click="prevNews(state.articleInfo.lastArticleViewDTO?.id)">{{state.articleInfo.lastArticleViewDTO?.title}}</span>
          </p>
          <p>
            下一篇：
            <span v-if="state.articleInfo.nextArticleViewDTO == null">暂无下一条</span>
            <span class="boot_tit" v-else @click="nextNews(state.articleInfo.nextArticleViewDTO?.id)">{{state.articleInfo.nextArticleViewDTO?.title}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import baseService from "@/service/baseService";
import { onMounted, reactive,watch,ref,onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import flvjs from "flv.js";
import { useAppStore } from "@/store";
import { IObject } from "@/types/interface";
const route = useRoute();
const store = useAppStore();
const flvPlayer = ref(null) as any;  // flv格式视频播放器实例
let timer = ref(null) as any;  // 定时器
const parentCurrentIndex = ref<number>(-1);
const childCurrentIndex = ref<number>(-1);
const state = reactive({
  dataForm: {
    articleId: route.query.articleId,
    channelId: route.query.channelId,
    getType: route.query.getType,
    keyword: route.query.keyword,
  },
  articleInfo: {} as any,
  activeName: "project",
  isShowFlvPlayer:false,  // 是否使用flv格式的视频播放器
  fileList:[],  // 公示文件列表
  type:-1,  // 类型
  leaderInfo:{} as any,  // 名誉会长信息
  council:"",  // 理事会、内设机构、直属单位详情
  articleIntroduce:"",  // 内设机构部门
  fileTitle:"",  // 公示文件名
  donationInfo:{} as any,  // 公开募捐资格证
});
const handler = (e:any) => {
  e.preventDefault();
  return false
}
onMounted(() => {
  getDetail();
});
onBeforeUnmount(() => {
  clearTimeout(timer.value);
});
watch(() => state.isShowFlvPlayer,(value) => {
  // 使用定时器，确保方法执行时dom元素已经渲染到页面上了  
  if(value){  // 值为true时才使用flvPlayer 
    timer.value = setTimeout(() => {
      createVideo();
    });
  }
});
/**
 * 匹配菜单数组元素下标
 */
 const findIndex = (array: any, parentId: string, parentIndex?: number) => {
  array.forEach((item: IObject, index: number) => {
    if (parentId == item.id) {
      childCurrentIndex.value = typeof parentIndex === 'undefined' ? 0 : index;
      return (parentCurrentIndex.value = typeof parentIndex === 'undefined' ? index : parentIndex);
    } else {
      if (item.children.length > 0) {
        findIndex(item.children, parentId, index);
      }
    }
  });
  return parentCurrentIndex.value;
};
/**
 * 处理面包屑
 */
const breadCrumbHandle = (articleTitle: string, channelId: string) => {
  let index = findIndex(store.state.menus, channelId) as any;
  store.updateState({
    navigationInfo: {
      parentName: store.state.menus[index].channelName,
      parentId: store.state.menus[index].id,
      childName: store.state.menus[index].children.length > 0 ? store.state.menus[index].children[childCurrentIndex.value].channelName : '',
      childId: channelId,
      articleTitle
    },
    parentNavCurrentIndex: index,
    childNavCurrentIndex: childCurrentIndex.value
  });
}
// 初始化flv视频播放器
const createVideo = () => {
  if(flvjs.isSupported()){
    const videoElement = document.getElementById("videoElement") as any;
    // 解决跨越问题...
    let videoUrl = state.articleInfo.nowArticleViewDTO?.articleVideoUrl;
    if(process.env.NODE_ENV == "development"){
      let url = new URL(videoUrl);
      videoUrl = `/videoapi${url.pathname}`;
    }
    flvPlayer.value = flvjs.createPlayer({
      type: "flv",
      isLive: true,
      hasAudio: true,  // 数据源是否包含音频
      hasVideo: true,  // 数据源是否包含视频
      cors: true, // 是否跨域
      url: videoUrl,
      
    });
    flvPlayer.value.attachMediaElement(videoElement);  // 挂载元素
    flvPlayer.value.load();  // 加载流
  }
};
/**
 * 获取文章详情
 */
const getDetail = () => {
  let params = state.dataForm as any;
  if (route.query.isPreview) {
    params.isPreview = route.query.isPreview;
  }
  baseService.get("/view/wsarticleView/details", params).then((res) => {
    window.scrollTo(0, 0);
    // 回到顶部并居中滚动条
    // window.scrollTo((document.body.scrollWidth - document.body.offsetWidth) / 2, 0);
    state.articleInfo = { ...res.data };
    breadCrumbHandle(res.data.nowArticleViewDTO.articleTitle, params.channelId);
    state.articleInfo.nowArticleViewDTO.articleContent =  state.articleInfo.nowArticleViewDTO.articleContent != null ? toHtml(
      state.articleInfo.nowArticleViewDTO.articleContent
    ) : '';
    // 总会对接数据
    if(res.data.nowArticleViewDTO?.datasource == 5){
      // 单独对总会对接生成的文章数据进行处理
      /**
       * 类型   
       *  2名誉会长、领导机构  
       *  3监事会 
       *  4内设机构 
       *  5直属单位
       *  6公示文件
       */
      state.type = res.data.nowArticleViewDTO?.philType;
      if(state.type == 2){
        state.leaderInfo = res.data.nowArticleViewDTO?.leaderInfo;
      }else if(state.type == 3 || state.type == 4 || state.type == 5){
        state.council = res.data.nowArticleViewDTO?.articleContent;
        state.articleIntroduce = res.data.nowArticleViewDTO?.articleIntroduce;
      }else if(state.type == 6){
        state.fileTitle = res.data.nowArticleViewDTO?.articleTitle;
        state.fileList = res.data.nowArticleViewDTO?.articleContent.split(",") || [];
      }else if(state.type == 7){
        state.donationInfo = res.data.nowArticleViewDTO?.donationInfo;
      }
    }
    if(res.data.nowArticleViewDTO.articleVideoUrl){
      // 获取视频格式，flv格式的视频启用flvPlayer
      getVideoFormat(res.data.nowArticleViewDTO.articleVideoUrl);
    }
  });
};
// 获取视频格式
const getVideoFormat = (videoUrl:string) => {
  let url = new URL(videoUrl);
  let index = url.pathname.lastIndexOf(".");
  let videoType = url.pathname.substring(index + 1);
  if(videoType == "flv"){
    state.isShowFlvPlayer = true;
  }
};
/**
 * 下一篇文章
 */
const nextNews = (id?: any) => {
  state.dataForm.articleId = id;
  getDetail();
};
/**
 * 上一篇文章
 */
const prevNews = (id?: any) => {
  state.dataForm.articleId = id;
  getDetail();
};
/**
 * 捐赠tab点击事件
 */
const handleClick = (event: any) => {
  state.activeName = event.props.name;
};
/**
 * 转换html
 */
const toHtml = (str: string) => {
  let rex = /&(lt|gt|nbsp|amp|quot);/gi;
  let arrEntities = {
    lt: "<",
    gt: ">",
    nbsp: " ",
    amp: "&",
    quot: '"',
  } as any;
  return str.replace(rex, (all, t) => {
    return arrEntities[t];
  });
};
</script>
<style scoped>
.home {
  min-height: calc(100vh - 220px - 48px - 258px);
  background-color: #fff;
}
.main {
  width: 1200px;
  margin: 0 auto;
}
.news-title {
  padding: 50px 0;
}

.news-title p {
  text-align: center;
}

.news-title p:first-child {
  font-size: 32px;
  color: #2c2c2c;
  font-weight: 700;
  margin-bottom: 23px;
}

.news-title p:last-child span {
  color: #999;
}

.news-title p:last-child span:last-child {
  margin-left: 60px;
}

.content {
  min-height: 35vh;
  width: 1000px;
  padding: 50px 0;
  margin: 0 auto;
  text-align: center;
}

.news-bottom {
  margin: 31px auto 48px;
  padding-left: 100px;
}

.news-bottom>p {
  line-height: 36px;
}

.news-bottom>p .boot_tit {
  display: inline-block;
}

.news-bottom>p .boot_tit:hover {
  color: #e50516;
  cursor: pointer;
  text-decoration: underline;
}

/** 视频组件样式 */
:deep(.d-player-dialog .d-player-dialog-body),
:deep(.d-player-contextmenu .d-player-contextmenu-body) {
  background-color: #fff !important;
}

:deep(.icon-play),
:deep(.d-player-wrap .d-player-control .d-control-tool .d-tool-bar .d-tool-item),
:deep(.d-player-wrap .d-player-control .d-control-tool .d-tool-bar .d-tool-item .d-tool-item-main) {
  color: #fff !important;
}

:deep(.el-tabs__item) {
  font-weight: 700;
}

:deep(.el-tabs__item.is-active),
:deep(.el-tabs__item.is-active:hover) {
  /* color: var(--comColor); */
  color: #e50516 !important;
}

:deep(.el-tabs__nav-wrap:after),
:deep(.el-tabs__active-bar) {
  background-color: var(--comColor);
  /* background-color:#E50516; */
}

.w-e-text-container>>>p {
  text-indent: 2em !important;
  text-align: left;
}
.w-e-text-container>>>p>span>strong{
  display: block;
  text-indent: 0 !important;
}

.w-e-text-container>>>p>img {
  display: block !important;
  margin: 0 auto !important;
}
.w-e-text-container>>>table td{
    height: 30px !important;
  }
  .w-e-text-container>>>video {
    width: 100%!important;
  }

:deep(.el-link){
  &:hover{
    color: #e50516
  }
}
.file{
  margin-top: 15px;
  >p{
    margin-top: 15px;
    &:hover{
      color: #e50516;
      cursor: pointer;
    }
  }
}
/* 总会对接部分数据样式调整 */
/* 公共文字样式 */
.org_content{
  text-indent: 2em;
  line-height: 26px;
  font-size: 16px;
}
/* 名誉会长 */
.leader{
  text-align: center;
  font-size: 16px;
}
.duty{
  margin: 25px;
}
.leader_photo{
  width: 240px;
  height: auto;
}
.leader_name{
  margin-top: 5px;
  margin-bottom: 18px;
}
/* 内设机构 */
.org_title{
  font-size: 18px;
  text-align: left;
  text-indent: 2em;
  margin-bottom: 10px;
  font-weight: bold;
}
/* 直属单位 */
.unit{
  text-align: left;
  line-height: 26px;
  font-size: 16px;
}
.unit_detail{
  white-space: pre-wrap;
}
/* 公示文件 */
.file_list{
  padding-top: 15px;
  text-align: left;
}
.file_list a{
  display: block;
  margin: 15px 5px;
}
/* 公开募捐资格证 */
.donation{
  text-align: left;
  font-size: 16px;
}
.donation p{
  margin: 35px 0;
}
.donation_dept{
  font-weight: bold;
}
.donation_cert{
  margin-top: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
.cert_title{
  margin-top: 30px;
  margin-right: 20px;
}
.donation_material{
  color: #e50516;
  cursor: pointer;
}
.borderBottom {
  border-bottom: 1px solid #efefef;
}
</style>

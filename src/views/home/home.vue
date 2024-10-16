<template>
  <div class="home">
    <div class="banner">
      <el-carousel trigger="click" indicator-position="none" arrow="never" height="560px">
        <el-carousel-item>
          <img src="../../assets/images/banner.png" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="main">
      <el-row class="statistic">
        <el-col class="donation-item" :span="6">
          <img class="icon" src="../../assets/images/hematopoietic-stem-cell-icon.png" />
          <p class="donation-title">造血干细胞捐献</p>
          <p class="donation-date">截止至2024年07月16日</p>
          <img class="line" src="../../assets/images/line.png" alt="">
          <p class="donation-realize">实现造血干细胞捐献</p>
          <p class="donation-number"><span class="number">281</span>例</p>
        </el-col>
        <el-col class="donation-item" :span="6">
          <img class="icon" src="../../assets/images/human-organ-icon.png" alt="">
          <p class="donation-title">人体器官捐献</p>
          <p class="donation-date">截止至2024年07月16日</p>
          <img class="line" src="../../assets/images/line.png" alt="">
          <p class="donation-realize">实现人体器官捐献</p>
          <p class="donation-number"><span class="number">281</span>例</p>
        </el-col>
        <el-col class="donation-item" :span="6">
          <img class="icon" src="../../assets/images/body-donation-icon.png" alt="">
          <p class="donation-title">遗体捐献</p>
          <p class="donation-date">截止至2024年07月16日</p>
          <img class="line" src="../../assets/images/line.png" alt="">
          <p class="donation-realize">实现遗体捐献</p>
          <p class="donation-number"><span class="number">281</span>例</p>
        </el-col>
        <el-col class="donation-item" :span="6">
          <img class="icon" src="../../assets/images/cornea-donation-icon.png" alt="">
          <p class="donation-title">角膜捐献</p>
          <p class="donation-date">截止至2024年07月16日</p>
          <img class="line" src="../../assets/images/line.png" alt="">
          <p class="donation-realize">实现角膜捐献</p>
          <p class="donation-number"><span class="number">281</span>例</p>
        </el-col>
      </el-row>
      <el-row class="volunteer-humanity">
        <div class="voluntary-registration">
          <div class="title">志愿登记</div>
          <div class="img-box">
            <a href="#" target="_blank">
              <img src="../../assets/images/human-organ.png" alt="">
            </a>
            <a href="#" target="_blank">
              <img src="../../assets/images/hematopoietic-stem-cell.png" alt="">
            </a>
            <a href="#" target="_blank">
              <img src="../../assets/images/volunteer.png" alt="">
            </a>
            <a href="#" target="_blank">
              <img src="../../assets/images/body-cornea-donation.png" alt="">
            </a>
            <a href="#" target="_blank">
              <img src="../../assets/images/voluntary-blood-donation.png" alt="">
            </a>
          </div>
        </div>
        <div class="humanistic-care">
          <div class="title">人文关怀</div>
          <img src="../../assets/images/organ-commemorate.png" alt="" @click="toMemory(2)">
          <img src="../../assets/images/cornea-commemorate.png" alt="" @click="toMemory(1)">
        </div>
      </el-row>
      <el-row class="leave-message">
        <img src="../../assets/images/message.png" alt="">
        <!-- <div id="container" class="message-box"></div> -->
        <WordCloud :data="wordCloudData" :width="1200" :height="550"/>
        <el-input placeholder="请输入您的留言" v-model="messageContent">
          <template #suffix>
            <el-button class="send-btn" @click="sendMessageHandler">发送留言</el-button>
          </template>
        </el-input>
      </el-row>
    </div>
    <!-- 首页弹窗 -->
    <tips-home ref="tipsHomeRef" />
    <!-- 验证码获取 -->
    <phone-number ref="phoneNumberRef" v-if="phoneNumberVisible" @getResponse="getCodeResult"/>
    <!--  -->
    <!-- <FireWork/> -->
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store';
import PhoneNumber from '@/components/phoneNumber-dialog/index.vue';
import baseService from '@/service/baseService';
import TipsHome from '@/components/tips-home/tips-home.vue';
import { IObject } from '@/types/interface';
import * as echarts from "echarts";
import 'echarts-wordcloud';
import { useDebounce, useEncrypt } from '@/utils/utils';
import FireWork from '@/components/fireWork/fireWork..vue';
import baseServiceDonation from '@/service/baseServiceDonation';

const router = useRouter();
const store = useAppStore();
// const parentCurrentIndex = ref<number>(-1);
// const childCurrentIndex = ref<number>(-1);
const tipsHomeRef = ref();
const phoneNumberRef = ref();
const phoneNumberVisible = ref(false);
const messageContent = ref("");  // 输入的留言
const wordCloudData = ref([
  { label: '生命奉献、生命之树常青！', value: 66 },
  { label: "因为你，我的生命变得更有意义", value: 73 },
  { label: "您跨越的光阴，会看到更美丽的风景", value: 75 },
  { label: "谢谢不知名的你，没有你就没有我的现在", value: 64 },
  { label: "跨越时空  延续生命", value: 62 },
  { label: "生命之约，大爱传递", value: 50 },
  { label: "愿你在天堂一样快乐!", value: 52 },
  { label: "愿你在另一个世界安好", value: 80 },
  { label: "感谢有你，一路相随", value: 70 },
  { label: "生命之花，向阳而生", value: 49 },
  { label: "希望他们在另一个天堂也会过的很好", value: 58 },
  { label: "爱相髓  永相髓", value: 64 },
  { label: "感谢你无私的爱", value: 59 },
  { label: "关爱生命，带着爱生活", value: 47 },
  { label: "关爱生命，带着爱生活", value: 70 },
  { label: "关爱生命，带着爱生活", value: 62 },
  { label: "关爱生命，带着爱生活", value: 57 },
  { label: "关爱生命，带着爱生活", value: 46 },
  { label: '生命奉献、生命之树常青！', value: 66 },
  { label: "因为你，我的生命变得更有意义", value: 73 },
  { label: "您跨越的光阴，会看到更美丽的风景", value: 75 },
  { label: "谢谢不知名的你，没有你就没有我的现在", value: 64 },
  { label: "跨越时空  延续生命", value: 62 },
  { label: "生命之约，大爱传递", value: 50 },
  { label: "愿你在天堂一样快乐!", value: 52 },
  { label: "愿你在另一个世界安好", value: 80 },
  { label: "感谢有你，一路相随", value: 70 },
  { label: "生命之花，向阳而生", value: 49 },
  { label: "希望他们在另一个天堂也会过的很好", value: 58 },
  { label: "爱相髓  永相髓", value: 64 },
  { label: "感谢你无私的爱", value: 59 },
  { label: "关爱生命，带着爱生活", value: 47 },
  { label: "关爱生命，带着爱生活", value: 70 },
  { label: "关爱生命，带着爱生活", value: 62 },
  { label: "关爱生命，带着爱生活", value: 57 },
  { label: "关爱生命，带着爱生活", value: 46 },
]);
watch(
  () => store.state.isConfigSwitch,
  (newValue) => {
    if (newValue) {
      /**
       * 特殊日子更换皮肤
       */
      window.document.querySelector('html')?.setAttribute('class', 'grayscale');
    }
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  Promise.all([getTips(), getHomeData(),getMessageList()]);
  // Promise.all([getMessageList()]);
  // Promise.all([getTips(), getHomeData()]);
  // initEchart();
});
// 获取留言列表
const getMessageList = () => {
  baseServiceDonation.get("/threeDonate/api/message/getNewsList").then((res) => {
    let arr = res.data.map((item:any) => {
      let obj = {
        label:item.messageContent,
      };
      return obj;
    });
    wordCloudData.value = arr;
  })
}
/**
 * 人文关怀
 * @param name 2-人体器官缅怀纪念园 1-遗体角膜缅怀纪念园
 */
const toMemory = (name:number) => {
  let list = store.state.menus.filter((item:any) => item.channelName == "人文关怀") || [];
  store.updateState({
    navigationInfo: {
      parentName: list[0]?.channelName || "人文关怀",
      parentId: list[0]?.id || "",
      childName: name == 2? "人体器官捐献者" : "遗体(角膜)捐献者",
      childId: "",
      articleTitle: ''
    },
    parentNavCurrentIndex: 0,
    childNavCurrentIndex: name - 1
  })
  router.push({
    path: '/humanisticCare',
    query: {
      name
    }
  });
}
// 发送留言
const sendMessageHandler = useDebounce(() => {
  let result = sessionStorage.getItem("verify");
  if(result){  // 已验证通过，可直接发送留言
    if(!messageContent.value){
      return ElMessage.warning("请填写留言内容！")
    }
    baseServiceDonation.post("/threeDonate/api/message/saveNews",{
      mobile:useEncrypt(result),
      messageContent:messageContent.value
    }).then((res) => {
      ElMessage.success("留言成功！");
      messageContent.value = "";
      // 重新获取留言列表
      getMessageList();
    })
  }
  if(!result){
    phoneNumberVisible.value = true;
    nextTick(() => {
      phoneNumberRef.value.init();
    })
  }
},500);
// 获取手机号验证结果
const getCodeResult = (res:any) => {
  // 将结果存储起来
  if(res.code == 200){
    sessionStorage.setItem("verify",res.mobile);
  }
  // 验证通过后，关闭弹窗
  phoneNumberVisible.value = false;
}
/**
 * 获取首页数据
 */
const getHomeData = () => {
  baseService.get('/view/subsite/homeViewView/rjh/home').then((res) => {
    // console.log(res);
  });
};
/**
 * 查看详情
 */
const lookNesDetail = (articleTitle: string, articleId: string, parentId: string) => {
  // let index = findIndex(store.state.menus, parentId) as any;
  // store.updateState({
  //   navigationInfo: {
  //     parentName: store.state.menus[index].channelName,
  //     parentId: store.state.menus[index].id,
  //     childName: store.state.menus[index].children.length > 0 ? store.state.menus[index].children[childCurrentIndex.value].channelName : '',
  //     childId: store.state.menus[index].children.length > 0 ? store.state.menus[index].children[childCurrentIndex.value].id : '',
  //     articleTitle
  //   },
  //   parentNavCurrentIndex: index,
  //   childNavCurrentIndex: 0
  // });
  // router.push({
  //   path: '/detail',
  //   query: {
  //     articleId,
  //     channelId: parentId
  //   }
  // });
  router.push({
    path: '/detail',
    query: {
      articleId,
      channelId: parentId
    }
  });
};
/**
 * 匹配菜单数组元素下标
 */
// const findIndex = (array: any, parentId: string, parentIndex?: number) => {
//   array.forEach((item: IObject, index: number) => {
//     if (parentId == item.id) {
//       childCurrentIndex.value = typeof parentIndex === 'undefined' ? 0 : index;
//       return (parentCurrentIndex.value = typeof parentIndex === 'undefined' ? index : parentIndex);
//     } else {
//       if (item.children.length > 0) {
//         findIndex(item.children, parentId, index);
//       }
//     }
//   });
//   return parentCurrentIndex.value;
// };
/**
 * 首页弹窗信息`
 */
const getTips = () => {
  baseService.get('/view/wsConfigView/windowsConfig').then((res) => {
    if (res.data && res.data.configSwitch == 1) {
      nextTick(() => {
        tipsHomeRef.value.init(res.data.configContent);
      });
    }
  });
};
const initEchart = () => {
  const echartDom = document.getElementById('container');
  const myChart = echarts.init(echartDom);
  const option = {
    series: [{
      type: 'wordCloud',
      // 控制词云图的形状，可选值为 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
      shape: 'star',
      keepAspect: false,
      // maskImage: maskImage,
      left: 'center',
      top: 'center',
      width: '100%',
      height: '90%',
      right: null,
      bottom: null,
      sizeRange: [10, 20],  // 词语的最小字体和最大字体，必须写一个范围，不能直接写每个字的大小
      rotationRange: [0, 0],  // 控制词语的旋转角度范围
      rotationStep: 45,  // 控制词语的旋转的步长
      gridSize: 30,  // 控制词云图的网格大小，值越大词语之间的间距越大
      drawOutOfBound: false,  // 控制词云图是否允许词语超出绘制区域
      layoutAnimation: true,  // 布局的时候是否有动画
      textStyle: {
        fontFamily: 'sans-serif',
        // fontWeight: 'bold',
        // color: function () {
        //   return 'rgb(' + [
        //     Math.round(Math.random() * 160),
        //     Math.round(Math.random() * 160),
        //     Math.round(Math.random() * 160)
        //   ].join(',') + ')';
        // }
        color: ["rgba(0, 0, 0, .8)", "rgba(0, 0, 0, .1)"]
      },
      emphasis: {
        // focus: 'self',
        // textStyle: {
        //   textShadowBlur: 3,
        //   textShadowColor: '#333'
        // }
      },
      //data属性中的value值却大，权重就却大，展示字体就却大
      data: [
        { name: '生命奉献、生命之树常青！', value: 66 },
        { name: "因为你，我的生命变得更有意义", value: 73 },
        { name: "您跨越的光阴，会看到更美丽的风景", value: 75 },
        { name: "谢谢不知名的你，没有你就没有我的现在", value: 64 },
        { name: "跨越时空  延续生命", value: 62 },
        { name: "生命之约，大爱传递", value: 50 },
        { name: "愿你在天堂一样快乐!", value: 52 },
        { name: "愿你在另一个世界安好", value: 80 },
        { name: "感谢有你，一路相随", value: 70 },
        { name: "生命之花，向阳而生", value: 49 },
        { name: "希望他们在另一个天堂也会过的很好", value: 58 },
        { name: "爱相髓  永相髓", value: 64 },
        { name: "感谢你无私的爱", value: 59 },
        { name: "关爱生命，带着爱生活", value: 47 },
        { name: "关爱生命，带着爱生活", value: 70 },
        { name: "关爱生命，带着爱生活", value: 62 },
        { name: "关爱生命，带着爱生活", value: 57 },
        { name: "关爱生命，带着爱生活", value: 46 },
      ]
    }]
  };
  option && myChart.setOption(option)
  //随着屏幕大小调节图表
  // window.addEventListener("resize", () => {
  //   myChart.resize();
  // });
};
</script>
<style lang="less" scoped>
@titleHeight: 40px;
@paddingTop: 14px;
@paddingBottom: 25px;
.home {
  // min-width: 1200px;
  background: url("../../assets/images/bg.png") 100% 100% / 100% 100% no-repeat;
  padding-bottom: 120px;
  overflow: hidden;
  .banner {
    width: 100%;
    height: @base-banner-height;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .main {
    width: @base-width;
    margin: 0 auto;
    text-align: center;
    // 数据统计部分样式
    .statistic {
      margin: 0 auto;
      margin-left: -140px;
      box-sizing: border-box;
      width: 1480px;
      padding-top: 40px;
      padding-left: 20px;
      height: 397px;
      box-sizing: border-box;
      .donation-item {
        box-sizing: border-box;
        .icon {
          width: 80px;
          height: 80px;
        }
        .donation-title {
          font-size: 28px;
          font-weight: 600;
          color: rgba(22, 187, 213, 1);
          margin-top: 23px;
          margin-bottom: 23px;
        }
        .donation-date,
        .donation-realize,
        .donation-number {
          font-size: 24px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.6);
        }
        .line {
          width: 328px;
          height: 4px;
          margin-top: 27px;
          margin-bottom: 39px;
        }
        .donation-realize {
          margin-bottom: 36px;
        }
        .number {
          font-size: 42px;
          font-weight: 600;
          color: rgba(255, 196, 20, 1);
          margin-right: 7px;
        }
      }
    }
    // 中间志愿登记与人文关怀部分样式
    .volunteer-humanity {
      margin: 0 auto;
      box-sizing: border-box;
      margin-top: 150px;
      height: 448px;
      // 标题样式
      .title {
        font-size: 32px;
        color: rgba(22, 187, 213, 1);
        font-weight: 700;
        margin-bottom: 30px;
        width: 100%;
      }
      // 志愿登记部分样式
      .voluntary-registration {
        width: 380px;
        box-sizing: border-box;
        margin-right: 140px;
        .img-box {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          a:first-child,
          a:last-child {
            width: 100%;
          }
          a:nth-child(3) {
            margin: 10px;
          }
          img {
            width: 120px;
            height: 120px;
          }
        }
      }
      // 人文关怀部分样式
      .humanistic-care {
        width: 680px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        img {
          width: 315px;
          height: 290px;
        }
      }
    }
    // 寄语部分样式
    .leave-message {
      // width: 1000px;
      width: 1200px;
      margin: 102px auto 0;
      justify-content: center;
      img {
        width: 315px;
        height: 72px;
      }
      // 留言
      .message-box {
        width: 100%;
        height: 484px;
        margin: 34px auto 61px;
      }
      :deep(.el-input__wrapper) {
        width: 660px;
        height: 51px;
        border-radius: 219px;
        padding-left: 24px;
        padding-right: 5px;
        .send-btn {
          width: 114px;
          height: 41px;
          border-radius: 219px;
          background: rgba(22, 187, 213, 1);
          color: #fff;
          line-height: 41px;
          font-size: 14px;
        }
      }
      :deep(.is-focus){
        box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
      }
    }
  }
}
</style>

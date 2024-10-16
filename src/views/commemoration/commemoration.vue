<template>
  <div class="container">
    <div class="wrapper">
      <bread-crumb style="background-color: #fff;width: 100%;"/>
      <div class="case">
        <!-- <img src="../../assets/images/memory.png" alt="" class="case_avatar"> -->
        <img :src="dataForm.photo" alt="" class="case_avatar">
        <p class="case_name">{{dataForm.realName}}</p>
        <div class="icon_list">
          <p class="case_icon left">
            <img src="../../assets/images/candle.png" alt="">
            <span>{{dataForm.candleCount}}</span>
          </p>
          <p class="case_icon">
            <img src="../../assets/images/flower.png" alt="">
            <span>{{dataForm.flowerCount}}</span>
          </p>
        </div>
        <div class="worship">
          <el-button @click="worshipHandler(1)"><el-icon class="el-icon--left"><img src="../../assets/images/candle_white.png"></el-icon>点烛祭拜</el-button>
        </div>
        <div class="worship">
          <el-button @click="worshipHandler(2)"><el-icon class="el-icon--left"><img class="flower" src="../../assets/images/flower_white.png"></el-icon>献花祭拜</el-button>
        </div>
      </div>
      <div class="info">
        <p class="info_title">基本信息</p>
        <div class="info_detail">
          <p>籍贯</p>
          <p class="info_value">{{dataForm.nativePlace}}</p>
          <p>享年</p>
          <p class="info_value">{{dataForm.deathAge}}</p>
          <p>出生日期</p>
          <p class="info_value">{{dataForm.birthday}}</p>
          <p>捐献类型</p>
          <p class="info_value">
            <span v-if="dataForm.donateType == 1">角膜</span>
            <span v-else-if="dataForm.donateType == 2">遗体(角膜)</span>
            <span v-else-if="dataForm.donateType == 3">遗体</span>
            <span v-else-if="dataForm.donateType == 4">器官</span>
            <span v-else-if="dataForm.donateType == 5">器官(角膜)</span>
            <span v-else-if="dataForm.donateType == 6">遗体(角膜)+遗体</span>
            <span v-else-if="dataForm.donateType == 7">遗体+遗体</span>
          </p>
          <p>捐献日期</p>
          <p class="info_value">2024-10-08</p>
        </div>
        <p class="info_title life">生平</p>
        <div class="life_detail" v-html="dataForm.biography"></div>
        <p class="info_title">留言板</p>
        <div class="message_detail">
          <!-- <p v-for="item in 20" :key="item">2024-04-07 10:50:59留言：我们永远想念你</p> -->
          <p v-for="item in personMessageList" :key="item.id">{{item.createDate + " "+ item.message}}</p>
        </div>
        <div class="message_select">
          <el-select placeholder="请选择您的留言" value-key="id" @change="messageHandler">
            <el-option v-for="item in messageList" :key="item.id" :value="item">{{ item.content }}</el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import BreadCrumb from '@/components/bread-crumb/bread-crumb.vue';
  import { onMounted, onUnmounted, reactive,ref } from 'vue';
  import { useRoute } from 'vue-router';
  import Emits from "@/utils/emits";
  import { useDebounce } from '@/utils/utils';
  import baseServiceDonation from '@/service/baseServiceDonation';
  
  const route = useRoute();

  const dataForm = reactive({
    id:"" as any,
    photo:"",  // 照片
    realName:"",  // 姓名
    candleCount:0,  // 蜡烛数量
    flowerCount:0,  // 鲜花数量
    nativePlace:"",  // 籍贯
    deathAge:"",  // 享年
    birthday:"", // 出生日期
    donateType:0,  // 捐献类型
    biography:"" as any, // 生平
  });
  // 用来记录蜡烛和献花被点击的次数
  let candleCount = 0;
  let flowerCount = 0;
  const messageList = ref<any[]>([]);  // 留言模板列表
  const personMessageList = ref<any[]>([]);  // 个人留言列表
  onMounted(() => {
    dataForm.id = route.query.id || "";
    getInfo(); // 获取详细信息
    getMessageList(); // 获取留言模板
    window.addEventListener("beforeunload",beforeunloadHandler);
  })

  // 获取详细信息
  const getInfo = () => {
    // baseService.get("/threeDonate/api/case/"+dataForm.id).then((res) => {
    baseServiceDonation.get("/threeDonate/api/case/"+dataForm.id).then((res) => {
      Object.assign(dataForm, res.data);
      getMessageInfo();
    })
  };
  // 获取个人留言记录
  const getMessageInfo = () => {
    baseServiceDonation.get("/threeDonate/api/case/getMessageList",{caseMissId:dataForm.id}).then((res) => {
      personMessageList.value = res.data;
    })
  };
  // 获取留言模板
  const getMessageList = () => {
    baseServiceDonation.get("/threeDonate/api/case/messageInfoList").then((res) => {
      messageList.value = res.data;
    })
  };
  // 点烛祭拜
  const worshipHandler = (type:number) => {
    if(type == 1){
      dataForm.candleCount ++;
      candleCount ++;
    }else if(type == 2){
      dataForm.flowerCount ++;
      flowerCount ++;
    }
    // useDebounce(() => {
    //   updateCount();
    //   candleCount = 0;
    //   flowerCount = 0;
    // },4000)
  };
  // 选择留言提交
  const messageHandler = (event:any) => {
    let params = {
      messageId : event.id,
      message : event.content,
      caseMissId:dataForm.id,
      realName: dataForm.realName
    }
    baseServiceDonation.post("/threeDonate/api/case/save",params).then((res) => {
      Emits.emit("startGif");
      Emits.emit("closeGif");
      getMessageInfo();
    })
  };
  // 更新点烛和献花祭拜数量
  const updateCount = () => {
    let params = {
      id:dataForm.id,
      candleCount:candleCount,
      flowerCount:flowerCount
    };
    baseServiceDonation.put("/threeDonate/api/case/updateCount",params).then((res) => {
      Object.assign(dataForm, res.data);
    });
  };
  // 离开页面时请求接口，保存点烛和献花祭拜数量
  onUnmounted(() => {
    updateCount();
    window.removeEventListener("beforeunload",beforeunloadHandler);
  });
  // 
  const beforeunloadHandler = async (event:any) => {
    // event.preventDefault();
    // event.returnValue = "您确认要离开此页面吗？";
    // await updateCount();
    updateCount();
    return false
  }
</script>
<style lang="less" scoped>
  @publicColor:#19C2D1;
  .container{
    background: #F2FAFE;
    padding-bottom: 64px;
    box-sizing: border-box;
    position: relative;
    .wrapper{
      box-sizing: border-box;
      min-height: @base-mian-height;
      width: @base-width;
      padding: 0px 66px 27px 14px;
      margin: 0 auto;
      padding-bottom: 0;
      margin-bottom: 0;
      background-color: #fff;
      display: flex;
      flex-wrap: wrap;
      .case{
        margin-top: 15px;
        width: 289px;
        text-align: center;
        .case_avatar{
          width: 213px;
          height: 265px;
        }
        .case_name{
          color: rgba(0, 0, 0, 0.9);
          font-size: 20px;
          font-weight: 600;
          margin: 23px auto 20px;
        }
        .icon_list{
          display: flex;
          justify-content: center;
          margin-bottom: 27px;
          align-items: center;
          img{
            width: 17px;
            height: 17px;
            margin-right: 8px;
          }
          .case_icon{
            display: flex;
            align-items: center;
          }
          .left{
            margin-right: 42px;
          }
        }
        .worship{
          width: 200px;
          height: 36px;
          margin: auto;
          img{
            width: 15px;
            height: 15px;
            color: #fff;
            position: relative;
            top: -2px;
          }
          .flower{
            top: 0;
          }
          .el-button{
            width: 100%;
            background-color: @publicColor;
            border-radius: 17px;
            color: #fff;
          }
        }
      }
      .info{
        box-sizing: border-box;
        margin-top: 15px;
        width: 831px;
        background-color: #F2FAFE;
        margin-bottom: 27px;
        padding: 25px 33px 50px 32px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.9);
        .info_title{
          font-size: 20px;
          color: @publicColor;
          font-weight: 600;
        }
        .info_detail{
          margin-top: 25px;
          display: flex;
          flex-wrap: wrap;
          p{
            width: 15%;
            margin-bottom: 25px;
          }
          .info_value{
            width: 35%;
          }
          .info_value{
            color: rgba(0, 0, 0, 0.6);
          }
        }
        .life{
          margin-top: 35px;
        }
        .life_detail{
          margin-top: 20px;
          line-height: 30px;
          margin-bottom: 60px;
        }
        .message_detail{
          margin-top: 24px;
          background-color: #fff;
          height: 371px;
          padding: 19px 24px 2px 24px;
          p{
            margin-bottom: 18px;
            line-height: 24px;
            letter-spacing: 0.8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          overflow-y: scroll;
        }
        .message_select{
          margin-top: 14px;
          background-color: #fff;
        }
      }
    }
  }
</style>

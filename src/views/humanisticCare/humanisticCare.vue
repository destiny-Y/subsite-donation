<template>
  <div class="container">
    <div class="wrapper">
      <bread-crumb style="background-color: #fff; padding-left: 14px;"/>
      <div class="tab_wrapper">
        <el-tabs v-model="activeName" @tab-click="clickHandler">
          <el-tab-pane class="title" v-for="(item,index) in titleList" :key="index" :label="item.label" :name="item.value"></el-tab-pane>
        </el-tabs>
        <div class="search">
          <el-input placeholder="请输入姓名搜索" v-model="dataForm.realName" clearable>
            <!-- <template #append>
              <el-icon class="icon" @click="test"><Search /></el-icon>
            </template> -->
          </el-input>
          <div class="icon_wrapper"><el-icon class="icon" @click="searchHandler"><Search /></el-icon></div>
        </div>
      </div>
      <div class="main_wrapper">
        <div class="list">
          <div class="list_item" v-for="(item,index) in dataList" :key="item.id">
            <!-- <img class="avatar" src="../../assets/images/memory.png" alt=""> -->
            <img class="avatar" :src="item.photo" alt="">
            <p class="item_name">{{item.realName}}</p>
            <button class="item_sacrifice" @click="toCommemoration(item.id)">在线祭奠</button>
          </div>
        </div>
        <div class="pagination">
          <el-pagination background layout="total,prev, pager, next,jumper" :page-size="8" :total="total" @current-change="pageCurrentChangeHandle"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import BreadCrumb from '@/components/bread-crumb/bread-crumb.vue';
  import baseServiceDonation from '@/service/baseServiceDonation';
  import { useDebounce } from '@/utils/utils';
  import { Search } from '@element-plus/icons-vue'
  import { onMounted, reactive, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Emits from '@/utils/emits';

  const router = useRouter();
  const route = useRoute();
  const titleList = ref([{label:"人体器官捐献者",value:2},{label:"遗体(角膜)捐献者",value:1}]);  // 标题列表
  const activeName = ref(2);
  const total = ref(0);
  const state = reactive({
    page: 1,
    limit:8,
  })
  const dataForm = reactive({
    memorialGarden:Number(route.query.name) || 2,  // 类型(2-人体器官捐献 1-遗体(角膜)捐献)
    realName:"",  // 真实姓名
  });
  const dataList = ref<any[]>([]);  // 数据列表
  onMounted(() => {
    activeName.value = Number(route.query.name);
    getDataList();  // 获取列表数据
  });
  // 路由参数刷新，重新获取数据
  watch(() => route.query.name,() => {
    dataForm.memorialGarden = Number(route.query.name);
    activeName.value = Number(route.query.name);
    getDataList();
  })
  // tab切换
  const clickHandler = useDebounce((tab:any) => {
    let name = tab.props.name;
    dataForm.memorialGarden = name;
    // dataList.value = []
    getDataList();  // 获取列表数据
    // 更新面包屑数据
    Emits.emit("updateBreadCrumb",name);
  },500);
  // 搜索回调
  const searchHandler = useDebounce(() => {
    if(dataForm.realName){
      getDataList();
    }
  },500);
  // 列表数据获取(memorialGarden所属祭奠园 1-遗体捐献者 2-人体器官捐献者)
  const getDataList = () => {
    baseServiceDonation.get("/threeDonate/api/case/page",{
      page: state.page,
      limit: state.limit,
      ...dataForm
    }).then((res) => {
      dataList.value = res.data.list;
      total.value = res.data.total;
    })
  };
  // 在线祭奠
  const toCommemoration = (id:number) => {
    router.push({
      path: '/commemoration',
      query: { id }
    })
  };
  // 分页, 当前页
  const pageCurrentChangeHandle =(val: number) => {    
    state.page = val;
    getDataList();
  };
</script>
<style lang="less" scoped>
  @publicColor:#19C2D1;
  .container{
    background: #F2FAFE;
    .wrapper{
      box-sizing: border-box;
      min-height: @base-mian-height;
      width: @base-width;
      // padding: 24px 0 0px;
      margin: 0 auto;
      padding-bottom: 0;
      margin-bottom: 0;
      background: #fff;
      .tab_wrapper{
        // padding: 0 100px 0 96px;
        padding: 0 100px;
        margin-bottom: 40px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        .el-tabs{
          width: 100%;
        }
        :deep(.el-tabs__active-bar){
          background-color: @publicColor;
        }
        .title,:deep(.el-tabs__item){
          box-sizing: border-box;
          width: 50%;
          display: flex;
          font-size: 22px;
          color: rgba(0, 0, 0, 0.6);
          cursor: pointer;
          :first-child{
            margin-right: 34px;
          }
        }
        :deep(.el-tabs__nav-wrap)::after{
          width: 0;
          bottom: -10px;
        }
        :deep(.el-tabs__item.is-active){
          color: rgba(0, 0, 0, 0.9);
        }
        .active{
          color: rgba(0, 0, 0, 0.9);
          position: relative;
          &::after{
            content: "";
            display: block;
            position: absolute;
            top: 35px;
            left: -6px;
            width: 162px;
            height: 3px;
            background-color: @publicColor;
            color: #000;
          }
        }
        .search{
          width: 50%;
          box-sizing: border-box;
          font-size: 14px;
          text-align: right;
          display: flex;
          justify-content: center;
          align-items: center;
          .el-input{
            width: 275px;
          }
          .icon_wrapper{
            width: 53px;
            text-align: center;
            background-color: @publicColor;
            height: 32px;
            font-size: 18px;
            border-radius: 0px 219px 219px 0px;
            line-height: 36px;
            color: #fff;
          }
          :deep(.el-input__wrapper){
            border-radius: 219px 0px 0px 219px;
            box-sizing: border-box;
            height: 32px;
            border: 1px @publicColor solid;
            padding-left: 18px
          }
          // :deep(.el-input-group){
          //   width: 275px;
          //   height: 32px;
          //   box-sizing: border-box;
          //   .el-input__wrapper{
          //     border-radius: 219px 0px 0px 219px;
          //     box-sizing: border-box;
          //     // border-color: @publicColor;
          //     border: 1px @publicColor solid;
          //   }
          //   .el-input-group__append{
          //     background-color: @publicColor;
          //     color: #fff;
          //   }
          //   .el-input-group__append{
          //     border-radius: 0px 219px 219px 0px;
          //     border: 1px solid transparent;
          //     height: 32px;
          //   }
          // }
        }
      }
      .main_wrapper{
        // padding: 0 54px 0 94px;
        padding: 0 94px;
        .list{
          display: flex;
          flex-wrap: wrap;
          // min-height: 602px;
          .list_item{
            margin-bottom: 60px;
            margin-right: 40px;
            width: 213px;
            text-align: center;
            .avatar{
              width: 100%;
              height: 265px;
            }
            .item_name{
              margin: 16px auto;
              font-size: 20px;
              font-weight: 600;
            }
            .item_sacrifice{
              border: none;
              width: 112px;
              height: 34px;
              border-radius: 146px;
              background-color: @publicColor;
              color: #fff;
              font-size: 16px;
              cursor: pointer;
            }
          }
        }
        .pagination {
          margin-top: 20px;
          // padding-bottom: 104px;
          padding-bottom: 137px;
          display: flex;
          justify-content: center;
          :deep(.el-pagination.is-background) .el-pager li:not(.is-disabled).is-active {
            background-color: @base-nav-bg-color;
            color: @base-white-color;
          }
          :deep(.el-pagination.is-background) .el-pager li:not(.is-disabled).is-active:hover {
            color: @base-white-color !important;
            cursor: pointer;
          }
          :deep(.el-input__wrapper.is-focus){
            box-shadow:0 0 0 1px @publicColor inset
          }
        }
      }
    }
  }
</style>

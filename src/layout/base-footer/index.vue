<template>
  <div class="footer">
    <div class="nav-box">
      <base-footer-nav :nav-list="footerNavList" :is-header-nav="false" />
    </div>
    <div class="other-box">
      <div class="top">
        <div class="left">
          <div class="nav">
            <div class="nav-item" v-for="(nav, index) in headerNavLit" :key="nav.id" @click="navRouterHandle(nav.id, index)">
              <p :class="{ 'nav-name': index != headerNavLit.length - 1 }">{{ nav.channelName }}</p>
            </div>
          </div>
          <div class="address">
            <p>地址：{{ siteInfo.officeAddress }}</p>
            <p>电话：{{ siteInfo.contactInfo }}</p>
            <p>邮编：{{ siteInfo.postalCode }}</p>
          </div>
          <div class="icp">
            <p>备案证号:<a href="https://beian.miit.gov.cn/" target="_blank" class="icp-text">渝ICP备13003948号-1</a></p>
            <p>渝公安备:<a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010302504938" target="_blank" class="icp-text">50010302504938号</a></p>
          </div>
        </div>
        <div class="rgiht">
          <a href="https://bszs.conac.cn/sitename?method=show&id=36512646FD6725CAE053022819AC3A73" target="_blank">
            <img src="../../assets/images/dangzhengjiguan.png" />
          </a>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010302504938" target="_blank">
            <img src="../../assets/images/jingcha.png" />
          </a>
          <img src="../../assets/images/guowuyuan.png" />
        </div>
      </div>
      <div class="bottom">Copyright©2013重庆市红十字会版权所有 渝公安备:50010302504938号</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useAppStore } from '@/store';
import { useRouter } from 'vue-router';
import { getDictDataList } from '@/utils/utils';
import BaseFooterNav from '../base-nav/index.vue';
import baseService from '@/service/baseService';
const router = useRouter();
const store = useAppStore();
const siteInfo = ref<any>({});
onMounted(() => {
  getHostInfo();
});
/**
 * 友情链接
 */
const links = ref<any>([]);
const footerNavList = ref<any>([]);
/**
 * 菜单
 */
const headerNavLit = ref<any>([]);
watch(
  () => store.state.menus,
  (newValue) => {
    if (newValue) {
      headerNavLit.value = store.state.menus;
    }
  }
);
watch(
  () => store.state.dicts,
  (newValue) => {
    getLinks(newValue);
  }
);
/**
 * 站点信息
 */
const getHostInfo = () => {
  baseService.get('/view/deptView/getSiteInfo').then((res) => {
    siteInfo.value = res.data;
    store.updateState({
      logoUrl: siteInfo.value.logo
    });
  });
};
/**
 * 友情链接
 */
const getLinks = (newValue: any) => {
  baseService.get('/view/wsfriendlinkView/list').then((res) => {
    footerNavList.value = [...getDictDataList(newValue, 'link_type')].map((item: any) => {
      let tempLink = res.data.find((link: any) => item.dictValue == link.linkType);
      item.children = typeof tempLink == 'undefined' ? [] : tempLink.linkList;
      return item;
    });
  });
};
const navRouterHandle = (id?: number, index?: any) => {
  store.updateState({
    navigationInfo:
      id != 1
        ? {
            parentName: headerNavLit.value[index].channelName,
            parentId: headerNavLit.value[index].id,
            childName: headerNavLit.value[index].children.length > 0 ? headerNavLit.value[index].children[0].channelName : '',
            childId: headerNavLit.value[index].children.length > 0 ? headerNavLit.value[index].children[0].id : ''
          }
        : {},
    parentNavCurrentIndex: index,
    childNavCurrentIndex: 0
  });
  router.push({
    path: id == 1 ? '/home' : '/newsPage'
  });
};
</script>

<style lang="less" scoped>
.footer {
  position: relative;
  .nav-box {
    width: 100%;
    background: @base-nav-bg-color;
  }
  .other-box {
    height: @base-footer-height;
    background: @base-white-color;
    .top {
      width: @base-width;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      .left {
        // flex: 1;
        width: 60%;
        line-height: 20px;
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          overflow: hidden;
          .nav-item {
            flex: 1;
            padding: 15px 0;
            .nav-name {
              border-right: 1px solid #eee;
              cursor: pointer;
            }
          }
        }
        .address,
        .icp {
          display: flex;
          // align-items: center;
          align-items: flex-start;
          overflow: hidden;
          padding-left: 28px;
          p {
            margin-right: 30px;
            .icp-text {
              color: rgb(187, 43, 50);
              text-decoration: underline;
            }
            &:last-child{
              margin-right: 0;
            }
          }
        }
        .address p:first-child{
          width: 47%;
        }
        .icp {
          p {
            padding: 15px 0;
          }
        }
      }
      .rgiht {
        // flex: 1;
        width: 40%;
        text-align: right;
        img {
          width: 100px;
          height: 100px;
        }
      }
    }
    .bottom {
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: #2c2c2c;
      color: #ccc;
    }
  }
}
</style>

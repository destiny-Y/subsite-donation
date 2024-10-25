import { defineStore } from 'pinia';
import { type IObject } from '@/types/interface';
import baseService from '@/service/baseService';
import { filterTree } from '@/utils/utils';
export const useAppStore = defineStore('useAppStore', {
  state: () => ({
    state: {
      logoUrl: '' as any,
      dicts: [] as any, //字典
      menus: [],
      isConfigSwitch: false,
      navigationInfo: {} as IObject,
      parentNavCurrentIndex: 0 as number, //存储当前点击了哪个父栏目
      childNavCurrentIndex: 0 as number //存储当前点击了哪个子栏目
    } as IObject
  }),
  actions: {
    updateState(data: IObject) {
      Object.keys(data).forEach((x: string) => {
        this.state[x] = data[x];
      });
    },
    initApp() {
      return Promise.all([
        baseService.get('/view/wsHomeViewView/dict/list'),
        baseService.get('/view/subsitechannel/channelList/donation'),
        baseService.get('/view/wsConfigView/switchConfig') //加载一键换肤
      ]).then(([dictDatas, menusData, configs]) => {
        let tempMenus = [...menusData.data];
        tempMenus.unshift({
          channelName: '首页',
          channelRoute: null,
          channelType: null,
          children: [],
          id: '1',
          parentName: null,
          pid: '0',
          pids: '0'
        });
        tempMenus = filterTree(tempMenus)
        this.updateState({
          dicts: dictDatas.data,
          menus: tempMenus,
          isConfigSwitch: configs.data.configSwitch == 1
        });
      });
    }
  },
  persist: {
    key: 'baseInfo',
    storage: localStorage // localStorage, sessionStorage
  } as any
});

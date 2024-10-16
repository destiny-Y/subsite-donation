import type { IObject } from '@/types/interface';
import { debounce, DebouncedFunc, DebounceSettings } from 'lodash';
import aes from './crypto';
/**
 * 是否只null和undefined值
 * @param vl
 * @returns
 */
export const isNullOrUndefined = (vl: unknown): boolean => {
  return vl === null || typeof vl === 'undefined';
};

/**
 * 获取对象下的字段值
 * @param record {}
 * @param key 'a.b.c'
 * @param defaultValue
 * @returns
 */
export const getValueByKeys = (record: IObject = {}, key: string, defaultValue?: unknown): any => {
  const keys = key.split('.');
  for (let i = 0; i < keys.length; i++) {
    record = record[keys[i]] || (i === keys.length - 1 ? defaultValue : {});
  }
  return record || defaultValue;
};

/**
 * 获取字典数据列表
 * @param dictType  字典类型
 */
// export const getDictDataList = (list: IObject[], dictType?: string): IObject[] => {
//   console.log(list)
//   console.log(dictType)
//   const type = list.find((element: IObject) => element.dictType === dictType);
//   if (type) {
//     return type.dataList;
//   } else {
//     return [];
//   }
// };
export const getDictDataList = (list: IObject[], dictType?: string): IObject[] => {
  const type = list.find((element: IObject) => element.dictType === dictType);
  if (type) {
    return type.allDictDataList;
  } else {
    return [];
  }
};

/**
 * 获取字典名称
 * @param dictType  字典类型
 * @param dictValue  字典值
 */
export const getDictLabel = (
  list: IObject[],
  dictType: string,
  dictValue: number
): string | number => {
  const type = list.find((element: IObject) => element.dictType === dictType);
  if (type) {
    // const val = type.dataList.find((element: IObject) => element.dictValue === dictValue + "");
    const val = type.allDictDataList.find(
      (element: IObject) => element.dictValue === dictValue + ''
    );
    if (val) {
      return val.dictLabel;
    } else {
      return dictValue;
    }
  } else {
    return dictValue;
  }
};

/**
 * 更换title
 */
export const changeNavTitle = (title: string) => {
  document.title = title;
};

/**
 * 手机号码
 * @param {*} s
 */
export const isMobile = (s: string): boolean => {
  return /^1[0-9]{10}$/.test(s);
};

/**
 * 电话号码
 * @param {*} s
 */
export const isPhone = (s: string): boolean => {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
};

/**
 * 身份证号
 * @param {*} s
 */
export const isCardNo = (s: string): boolean => {
  return /(^\d{15}$)|(^\d{17}(\d|X)$)/.test(s);
};
/**
 * 正整数
 * @param {*} s
 */
export const isNumber = (s: string): boolean => {
  return /^\+?[1-9][0-9]*$/.test(s);
};

// 获取信息时使用私钥解密手机号&身份证号
export const useDecrypt = (value: any) => {
  if (value && value !== undefined && value.includes('ZJGY-')) {
    const aesValue = value.substring(5);
    return aes.decrypt(aesValue);
  }
};

// 传递信息时使用私钥加密手机号&身份证号
export const useEncrypt = (value: any) => {
  console.log(value);
  return value ? 'ZJGY-' + aes.encrypt(value) : value;
};

// 手机号脱敏
export function getphoneteltm(value: any) {
  if (!value) return;
  return value.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2');
}

/**
 * 证件号脱敏
 * @param {*} value
 */
export function peridcardtm(value: any) {
  if (!value) return;
  // return value.replace(/^(.{1})(?:\d+)(.{1})$/, "\$1****************\$2");

  const digits = 1;
  const reg = new RegExp(`(^\\w{${digits}})(\\w+)(\\w{${digits}}$)`, 'g');
  return value.replace(reg, function (...args: any) {
    let tempStr = '';
    if (args[2] && args[2].length) {
      for (let i = 0, len = args[2].length; i < len; i++) {
        tempStr += '*';
      }
    }
    return args[1] + tempStr + args[3];
  });
}

/**
 * 姓名脱敏
 * @param {*} value
 */
export function userNametm(value: any) {
  if (!value) return;
  return '*' + value.substring(1);
}

/**
 * 节流函数 `created() {this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);}`
 * @param fn
 * @param wait
 * @returns
 */
export const useDebounce = (
  fn: (e?: any) => any,
  wait?: number,
  options?: DebounceSettings
): DebouncedFunc<any> => {
  return debounce(fn, wait ?? 1000, {
    leading: true,
    trailing: false,
    ...options
  });
};

/**
 * 对栏目列表进行过滤，只展示只展示isHide为0的
 * @param tree
 * @param arr
 * @returns
 */
export const filterTree = (tree: any, arr: any = []) => {
  if (!tree.length) return;
  for (let item of tree) {
    // 循环数组，然后过滤数据
    // 如果该条数据isHide不为0时，跳出本次循环
    if (item.isHide && item.isHide !== 0) continue;
    // if(item.isHide && item.isHide !== 0){
    //   if(item.isEmpty !== 0){
    //     continue;
    //   }
    // }
    // 如果满足条件时，用新node代替，然后把chilren清空
    let node = { ...item, children: [] } as any;
    // 然后添加到新数组中
    arr.push(node);
    // 如果有子节点，调用递归函数，并把空数组传给下一个函数
    // 利用引用数据类型的特性，实现浅拷贝
    // 递归函数过滤时会改变这个空数组数据，从而实现层级结构过滤
    if (item.children && item.children.length) {
      filterTree(item.children, node.children);
    }
  }
  return arr;
};

export interface IFunction<T = any> {
  (x?: any): T;
}

export interface IObject<T = any> {
  [key: string]: T;
}

export interface IHttpResponse {
  code: number;
  msg: string;
  data: any;
}

export interface ICacheOptions {
  /**
   * 是否取值后立即删除缓存
   */
  isDelete?: boolean;
  /**
   * 是否采用JSON格式化缓存值
   */
  isParse?: boolean;
  /**
   * 是否采用会话缓存介质
   */
  isSessionStorage?: boolean;
}

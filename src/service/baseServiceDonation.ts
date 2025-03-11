/**
 * 供门户网站调用博爱山城接口使用
 */
import { type IHttpResponse, type IObject } from "@/types/interface";
import http from "../utils/http";


// let base = "http://192.168.110.37:8181"  // 詹祥云本地
// let base = "https://tss.cqredcross.org.cn"  // 博爱山城正式服
let base = "https://testthree.firstaidaed.com.cn"  // 博爱山城测试服
/**
 * 常用CRUD
 */
export default {
  /**
   * 删除
   * @param path
   * @param params
   * @returns
   */
  delete(path: string, params: IObject): Promise<IHttpResponse> {
    return http({
      baseURL:base,
      url: path,
      data: params,
      method: "DELETE"
    });
  },
  get(path: string, params?: IObject, headers?: IObject): Promise<IHttpResponse> {
    return new Promise((resolve, reject) => {
      http({
        baseURL:base,
        url: path,
        params,
        headers,
        method: "GET"
      })
        .then(resolve)
        .catch((error) => {
          if (error !== "-999") {
            reject(error);
          }
        });
    });
  },
  put(path: string, params?: IObject, headers?: IObject): Promise<IHttpResponse> {
    return http({
      baseURL:base,
      url: path,
      data: params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      method: "PUT"
    });
  },
  /**
   * 通用post方法
   * @param path
   * @param body
   * @returns
   */
  post(path: string, body?: IObject, headers?: IObject): Promise<IHttpResponse> {
    return http({
      baseURL:base,
      url: path,
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      data: body
    });
  }
};

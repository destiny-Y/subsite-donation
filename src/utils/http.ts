import axios, { type AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { ElMessage } from 'element-plus';
import { getValueByKeys } from './utils';
import type { IHttpResponse, IObject } from '@/types/interface';
import router from '@/router';
// const devUrl = "https://hesenbai.natapp4.cc";
// const devUrl = "http://192.168.110.104:8080";
// const devUrl = "http://192.168.110.37:8181"; // 詹祥云本地
const devUrl = "https://testfive.firstaidaed.com.cn/api"; //测试服地址
// const devUrl = "https://test.cqredcross.org.cn:1443"; //正式服地址
// const devUrl = 'https://www.cqredcross.org.cn/api'; //正式服地址
// window.SITE_CONFIG.apiURL =
// process.env.NODE_ENV === 'development' ? devUrl : `${window.location.origin}/api`;
const http = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devUrl : `${window.location.origin}/api`,
  timeout: 30000,
});

http.interceptors.request.use(
  function (config: any) {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Request-Start'] = new Date().getTime();
    if (process.env.NODE_ENV !== 'development') {
      config.headers['Website-host'] = "https://jxzx.cqredcross.org.cn";
    }
    if (config.method?.toUpperCase() === 'GET') {
      config.params = { ...config.params, _t: new Date().getTime() };
    }
    if (Object.values(config.headers).includes('application/x-www-form-urlencoded')) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response) => {
    // 响应成功
    if (response.data.code === 200) {
      return response;
    }
    // else if(response.data.code === 201){
    //   ElMessage.warning(response.data?.msg || response.data.message);
    //   return response
    // }

    if(response.data.code == 201){
      ElMessage.warning(response.data?.msg || response.data.message);
    }else{
      // 错误提示
      ElMessage.error(response.data?.msg || response.data.message);
    }

    if (response.data.code === 401) {
      //自定义业务状态码
      redirectLogin();
    }

    return Promise.reject(new Error(response.data?.msg || response.data.message || 'Error'));
  },
  (error) => {
    const status = getValueByKeys(error, 'response.status', 500);
    const httpCodeLabel: IObject<string> = {
      400: '请求参数错误',
      401: '未授权，请登录',
      403: '拒绝访问',
      404: `请求地址出错: ${getValueByKeys(error, 'response.config.url', '')}`,
      408: '请求超时',
      500: 'API接口报500错误',
      501: '服务未实现',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
      505: 'HTTP版本不受支持'
    };
    if (error && error.response) {
      console.error('请求错误', error.response.data);
    }
    if (status === 401) {
      redirectLogin();
    }
    return Promise.reject(new Error(httpCodeLabel[status] || '接口错误'));
  }
);

const redirectLogin = () => {
  router.replace('/login');
  return;
};

export default (o: AxiosRequestConfig): Promise<IHttpResponse> => {
  return new Promise((resolve, reject) => {
    http(o)
      .then((res) => {
        return resolve(res.data);
      })
      .catch(reject);
  });
};

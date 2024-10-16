// import app from "@/constants/app";
import { IHttpResponse, IObject } from "@/types/interface";
import { getToken } from "@/utils/cache";
import axios from "axios";

export default {
  get(path: string, params?: IObject): Promise<IHttpResponse> {
    return new Promise((resolve, reject) => {
      axios({
        // url: `${app.api}${path}`,
        url:path,
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${getToken()}`
        // },
        responseType: "blob",
        // params: params
      })
        .then((res) => {
          downloadFile(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  post(path: string, data?: IObject): Promise<IHttpResponse> {
    return new Promise((resolve, reject) => {
      axios({
        // url: `${app.api}${path}`,
        url: path,
        method: "POST",
        headers: {
          // Authorization: `Bearer ${getToken()}`
          // "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
        responseType: "blob",
        data: data
      })
        .then((res) => {
          downloadFile(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};

const downloadFile = (res: IObject) => {
  const filename = decodeURIComponent(res.headers["content-disposition"].split("filename=")[1]);
  const blob = new Blob([res.data]);
  const href = window.URL.createObjectURL(blob);
  const downLoadElement = document.createElement("a");
  downLoadElement.href = href;
  downLoadElement.download = filename;
  document.body.appendChild(downLoadElement);
  downLoadElement.click();
  document.body.removeChild(downLoadElement);
  window.URL.revokeObjectURL(href);
};

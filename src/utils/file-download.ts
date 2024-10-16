export const fileDownLoad = (fileUrl: string, fileName: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', fileUrl, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (xhr.status === 200) {
      const blob = xhr.response;
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
  };
  xhr.send();
};

export const downLoad = (url: string, fileName: string) => {
  const getBlob = (url: string) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      };
      xhr.send();
    });
  };
  getBlob(url).then((blob: any) => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    console.log(url);

    a.setAttribute('href', url); //文件下载地址
    a.setAttribute('target', '_blank');
    a.setAttribute('download', fileName); //修改文件名
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  });
};

export const getFileByUrl = async (url: string, fileName: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    console.log(response);
    throw new Error('请求下载文件地址Error');
  }
  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = urlBlob;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(urlBlob);
};

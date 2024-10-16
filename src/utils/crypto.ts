import CryptoJS from "crypto-js";
//秘钥, 建议设置其他的字符, 这里只是为了演示，一般长度是16位
const key = CryptoJS.enc.Utf8.parse("absoietlj32fai12");
// 偏移量, 建议设置其他的字符, 这里只是为了演示，一般长度是16位
const iv = CryptoJS.enc.Utf8.parse("absoietlj32fai12");
export default {
  //加密
  encrypt(data: any) {
    const srcs = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  //解密
  decrypt(encrypted: any) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  },
};

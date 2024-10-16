<template>
  <el-dialog style="border-radius: 10px;" v-model="visible" class="wrapper" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" destroy-on-close>
    <template #header="{ titleId, titleClass }">
      <div class="my_header">
        <p :id="titleId" :class="titleClass">发布留言需进行手机号验证</p>
      </div>
    </template>
    <el-form :model="dataForm" label-width="40px" ref="dataFormRef">
      <el-form-item>
        <el-input placeholder="手机号码" v-model="dataForm.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="btn_wrapper">
          <el-input placeholder="验证码" v-model="dataForm.code"></el-input>
          <p class="counter" v-if="count > 0">{{ count }} S</p>
          <el-button @click="getVerificationCode" v-else>获取验证码</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="footer_btn">
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
  import baseServiceDonation from '@/service/baseServiceDonation';
  import { isMobile, useDebounce, useEncrypt } from '@/utils/utils';
  import { reactive, ref } from 'vue';

  const emit = defineEmits(['getResponse'])
  const visible = ref(false);
  const dataFormRef = ref();
  const dataForm = reactive({
    mobile:"",  // 手机号码
    code:"",  // 验证码
  });
  let count = ref(0);
  const init = () => {
    visible.value = true;
    // 重置表单数据
    if (dataFormRef.value) {
      dataFormRef.value.resetFields();
    }
  };
  // 获取验证码
  const getVerificationCode = () => {
    if(!dataForm.mobile){
      return ElMessage.warning("请填写手机号码！")
    }
    if(!isMobile(dataForm.mobile)){
      return ElMessage.warning("请填写正确的手机号码!");
    }
    // 60s倒计时
    count.value = 60;
    const timer = setInterval(() => {
      count.value--;
      if(count.value <= 0){
        clearInterval(timer);        
      }
    }, 1000);
    // 发送验证码
    let mobile = useEncrypt(dataForm.mobile);
    baseServiceDonation.post("/threeDonate/api/message/captcha",{
      mobile,
    }).then((res) => {
      // console.log(res);
    })
  };
  // 提交
  const handleSubmit = useDebounce(() => {
    if(!dataForm.mobile){
      return ElMessage.warning("请填写手机号码！")
    }
    if(!isMobile(dataForm.mobile)){
      return ElMessage.warning("请填写正确的手机号码!");
    }
    if(!dataForm.code){
      return ElMessage.warning("请填写验证码！")
    }
    baseServiceDonation.post("/threeDonate/api/message/checkCaptcha",{
      mobile: useEncrypt(dataForm.mobile),
      captcha: dataForm.code,
    }).then((res:any) => {
      res.mobile = dataForm.mobile;
      ElMessage.success({
        message: "验证成功！",
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit("getResponse",res);
        }
      });
    })
  });
  defineExpose({
    init,
  })
</script>
<style lang="less" scoped>
  .my_header{
    padding-top: 40px;
    padding-left: 40px;
    p{
      font-size: 30px;
      color: #222;
    }
    margin-bottom: 40px;
  }
  .el-input{
    width: 90%;
    height: 55px;
    :deep(.el-input__wrapper){
      border-radius: 10px;
      font-size: 16px;
      padding-left: 25px;
    }
    :deep(.is-focus){
      box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
    }
  }
  .el-button,.counter{
    width: 90%;
    background-color: #19C2D1;
    border: none;
    height: 55px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
  }
  .btn_wrapper{
    width: 90%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .el-button,.counter{
      margin-left: 15px;
      width: 37%;
    }
    .counter{
      line-height: 55px;
      text-align: center;
    }
  }
  .footer_btn{
    padding-left: 40px;
    margin-top: 45px;
    margin-bottom: 40px;
  }
</style>
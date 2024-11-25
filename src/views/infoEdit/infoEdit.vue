<template>
  <div class="container">
    <div class="wrapper">
      <bread-crumb style="background-color: #fff;width: 100%;"/>
      <div class="info">
        <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="100px" >
          <el-form-item style="width: 100%;" prop="photo">
            <el-upload class="avatar-uploader"  ref="nailRef" :action="uploadUrl" :show-file-list="false" :on-success="handleImgSuccess" :before-upload="beforeImgUpload">
              <img v-if="dataForm.photo" :src="dataForm.photo" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item prop="realName" label="姓名">
            <el-input placeholder="请输入姓名" v-model="dataForm.realName"></el-input>
          </el-form-item>
          <el-form-item prop="gender" label="性别">
            <el-select v-model="dataForm.gender" placeholder="请选择性别">
              <el-option label="男" :value="'0'"></el-option>
              <el-option label="女" :value="'1'"></el-option>
              <el-option label="保密" :value="'2'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="donateDate" label="捐献日期">
            <el-date-picker style="width: 100%;" v-model="dataForm.donateDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择捐献日期"></el-date-picker>
          </el-form-item>
          <el-form-item prop="birthday" label="出生日期">
            <el-date-picker style="width: 100%;" v-model="dataForm.birthday" type="date" value-format="YYYY-MM-DD" placeholder="请选择出生日期"></el-date-picker>
          </el-form-item>
          <el-form-item prop="biography" label="生平">
            <el-input show-word-limit maxlength="300" type="textarea" :autosize="{minRows:1,maxRows:25}" v-model="dataForm.biography" placeholder="请输入生平"></el-input>
          </el-form-item>
          <el-form-item prop="deathAge" label="享年">
            <el-input placeholder="请输入享年" v-model="dataForm.deathAge"></el-input>
          </el-form-item>
          <el-form-item prop="nativePlace" label="籍贯">
            <el-cascader style="width: 100%;" size="default" :options="regionData" v-model="nativePlace"></el-cascader>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号">
            <el-input v-model="dataForm.mobile" placeholder="请输入指定执行人手机号"></el-input>
          </el-form-item>
          <el-form-item prop="captcha" label="验证码">
            <div class="captcha_wrapper">
              <el-input v-model="dataForm.captcha" placeholder="请输入验证码"></el-input>
              <p v-if="count > 0">{{ count }} S</p>
              <el-button v-else @click.stop="getVerificationCode">获取验证码</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="submit_btn">
          <el-button @click="handleSubmit">提交修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import BreadCrumb from "@/components/bread-crumb/bread-crumb.vue";
  import baseServiceDonation from '@/service/baseServiceDonation';
  import { useDebounce, useEncrypt,isMobile } from '@/utils/utils';
  import { regionData, codeToText } from "element-china-area-data";
  import type { UploadProps } from "element-plus";
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  let count = ref(0);
  let api = "http://192.168.110.37:8181";  // 詹祥云本地
  // let api = "https://tss.cqredcross.org.cn"  // 博爱山城正式服
  // let api = "https://testthree.firstaidaed.com.cn"  // 博爱山城测试服
  const uploadUrl = ref(`${api}/oss/file/upload`);  // 文件上传路径
  // 用于收集用户输入
  const dataForm = reactive({
    id:route.query.id,
    realName:"",  // 姓名
    gender:"",  // 性别
    mobile:"",
    photo:"",
    birthday:"",
    donateDate:"",
    deathAge:"",  // 享年
    nativePlace:"",  // 籍贯
    nativePlaceId:"",
    biography:"",
    captcha:"",  // 验证码
  });
  const nativePlace = ref([]);  // 籍贯
  const nailRef = ref();
  const dataFormRef = ref();
  const validateMobile = (rule: any, value: string, callback: (e?: Error) => any): any => {
    if (value && !isMobile(value)) {
      return callback(new Error("手机号格式错误"));
    }
    callback();
  };
  const rules = {
    realName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
    gender: [{ required: true, message: "必填项不能为空", trigger: "change" }],
    donateDate: [{ required: true, message: "必填项不能为空", trigger: "change" }],
    birthday: [{ required: true, message: "必填项不能为空", trigger: "change" }],
    deathAge: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
    nativePlace: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
    mobile: [{ required: true, message: "必填项不能为空", trigger: "blur" },{validator:validateMobile,trigger: "blur"}],
    captcha: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  };

  // 获取个人信息
  const getInfo = () => {
    baseServiceDonation.get("/threeDonate/api/case/"+dataForm.id).then((res) => {
      Object.assign(dataForm, res.data);
      // 籍贯回显
      nativePlace.value = res.data.nativePlaceId.split(",")
    })
  };
  onMounted(() => {
    getInfo();
  })
  // 头像上传成功后的回调
  const handleImgSuccess: UploadProps["onSuccess"] = (response) => {
    dataForm.photo = response.data.url;
    nailRef.value?.clearFiles();
  };
  // 头像上传之前的回调
  const beforeImgUpload: UploadProps["beforeUpload"] = (rawFile) => {    
    const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
    const isJPG = type.includes(rawFile.type);
    if (!isJPG) {
      ElMessage.error("请上传jpg/png格式的图片！!");
      return false;
    } else if (rawFile.size / 1024 / 1024 > 5) {
      ElMessage.error("上传图片不能超过5MB!");
      return false;
    }
    return true;
  };
  // 获取验证码(同时校验手机号码)
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
    let params = {
      mobile:useEncrypt(dataForm.mobile),
      id:dataForm.id
    }
    baseServiceDonation.get("/threeDonate/api/case/checkMobile",params).then((res) => {
      if(res.code == 200){
        ElMessage.success("验证码已发送到您的手机，请注意查收!");
      }
    });
  };
  // 验证输入的手机号码与验证码
  const checkCaptcha = () => {
    return baseServiceDonation.post("/threeDonate/api/message/checkCaptcha",{
      mobile: useEncrypt(dataForm.mobile),
      captcha: dataForm.captcha,
    })
  };
  // 表单提交
  const handleSubmit = useDebounce(() => {
    // 处理籍贯数据
    dataForm.nativePlace = nativePlace.value.map((item) => codeToText[item]).join("/")
    dataForm.nativePlaceId = nativePlace.value.join(",")
    dataFormRef.value.validate(async(valid: boolean) => {
      if (!valid) {
        return false;
      }
      // 处理手机号校验结果
      // let response = await checkCaptcha();
      await checkCaptcha();
      baseServiceDonation.post("threeDonate/api/case/updateCaseMiss",dataForm).then((res) => {
        if(res.code == 200){
          ElMessage.success({
            message: "修改成功",
            type: "success",
            duration: 1000,
            onClose: () => {
              router.go(-1)
            }
          });
        }
      })
    })
  })

</script>
<style lang="less" scoped>
  @baseColor:#60C6CE;
  .container{
    background: #F2FAFE;
    box-sizing: border-box;
    position: relative;
    .wrapper{
      width: @base-width;
      margin: 0 auto;
      background-color: #fff;
      padding-bottom: 300px;
      padding-left: 14px;
      .info{
        padding-top: 75px;
        padding-left: 52px;
        padding-right: 66px;
        :deep(.el-form){
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
            .el-form-item__content{
              flex: 0.9;
            }
          }
        }
        .captcha_wrapper{
          width: 100%;
          display:flex;
          justify-content: space-between;
          position: relative;
          p,.el-button{
            position: absolute;
            width: 120px;
            background-color: @baseColor;
            border: @baseColor;
            color: #fff;
            font-size: 18px;
            right: 0;
          }
          p{
            text-align: center;
            border-radius: 4px;
          }
        }
        .submit_btn{
          margin: 75px auto 0px;
          text-align: center;
          .el-button{
            width: 214px;
            height: 53px;
            border-radius: 4px;
            background-color: @baseColor;
            color: #fff;
            border: @baseColor;
            font-size: 18px;
          }
        }
      }
    }
  }
  .avatar-uploader{
    margin: 0 auto 74px;
    .avatar {
      width: 213px;
      height: 265px;
      display: block;
    }
  }
  :deep(.avatar-uploader) .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  :deep(.avatar-uploader) .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  :deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 213px;
    height: 265px;
    text-align: center;
  }

</style>

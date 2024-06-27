<template>
  <el-container class="mall-login-container">
    <el-header class="mall-login-header">mall商城管理平台</el-header>
    <el-header class="mall-login-header-phone" :class="{'mall-login-header-phone-trans' : showFormPhone}">
      <span>WELCOME</span>
      <span>欢迎使用mall管理平台</span>
    </el-header>
    <el-main class="mall-login-main">
      <el-row class="mall-login-content" :class="{'mall-login-con-phone': showFormPhone}">
        <el-col :span="5" class="content-col">
          <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm"
              class="demo-ruleForm content-form"
              @keyup="enterKeyUpLogin($event)"
          >
            <el-form-item label="账号：" prop="account" class="form-item">
              <el-input
                  type="text"
                  v-model="ruleForm.account"
                  autocomplete="off"
                  placeholder="管理员账号"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="pass" class="form-item">
              <el-input
                  type="password"
                  v-model="ruleForm.pass"
                  autocomplete="off"
                  placeholder="密码"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button class="login-button form-item-btn" type="primary" @click="loginAdmin($refs.ruleForm,ruleForm.account,ruleForm.pass)">登录</el-button>
              <el-button class="forget-password form-item-btn" @click="enterResetPage()">忘记密码？</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="mall-login-footer">
      <el-row class="footer-row">
        <el-col :span="10">版权所有 zcf 公司地址：广东省深圳市宝安区</el-col>
      </el-row>
      <el-row class="footer-row">
        <el-col :span="10">
          电话：400-8xxx-813 07x7-828rexx | 粤ICP备12054983号 | <a href="javascript:void (0)">粤公网安备44060402rexx号</a>
        </el-col>
      </el-row>
      </el-footer>
  </el-container>
</template>

<script lang="ts">
import { encrypt } from "../common/crypt";
import {defineComponent, ref} from "vue";
import { useRouter } from "vue-router";
import { getAdministratorInfo, loginAdministrator } from "../network/request";
import { userStore } from "../pinia/pinia";
import { storeToRefs } from "pinia";
import { addDynamicRoutes } from "../router";

export default defineComponent( {
  name: "login",
  setup(){

    //忘记密码，引导管理员进入重置密码页面
    let router = useRouter()
    function enterResetPage (){
      router.push('/resetPassword')
    }

    let userStorePinia = userStore()
    const { token } = storeToRefs(userStorePinia)

    let showFormPhone = ref(false)

    return {
        enterResetPage, userStorePinia,token,addDynamicRoutes,
        showFormPhone
    }
  },
  data() {
    let validatePass = (rule:string, value:string, callback:any) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        let passObj:any = this.ruleForm
        if (passObj.pass !=='') {
          let myForm:HTMLFormElement = this.$refs.ruleForm as HTMLFormElement
          myForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validateAccount = (rule:string, value:string, callback:any) => {

      //设置账号验证规则
      let RegExpPhone:RegExp = /^((13[0-9])|(15[^4])|(18[^4])|(199))\d{8}/
      let RegExpMail:RegExp = /^[1-9]\d{7,10}@qq\.com/

      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (!RegExpMail.test(value) && !RegExpPhone.test(value)) {
        callback(new Error('账号格式不正确！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass:<string>'',
        account:<string>''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        account: [{ validator: validateAccount, trigger: 'blur' }]
      },
    }
  },
  methods: {
    //管理员登录
    loginAdmin(form:any,account:string,password:string){
      //点击登录按钮，对表单进行验证，验证通过才能向后台发起登录请求
      form.validate((valid:any) => {
        if (valid) {
          loginAdministrator(account,encrypt(password)).then(result => {
            //登录成功进入管理页面
            if (result.data['success']){
              this.userStorePinia.setToken(result.data['token'])
              this.userStorePinia.setRights(JSON.stringify(result.data['rights']))
              this.addDynamicRoutes()

              this.$router.push('/')
            }
            else {
              alert(result.data['failed'])
            }

            //登录成功后获取用户信息
            getAdministratorInfo(this.token).then(result =>{
              if (result.data.info){

                this.userStorePinia.setUserInfo(JSON.stringify(result.data.info))
              }
              //console.log(result)
            }).catch(err =>{
              console.log(err)
            })

          }).catch(err => {
            console.log(err)
          })
        }
        else {
          // console.log('err submit')
          return false
        }
      })
    },
    //监听键盘按键，当用户抬起enter键后发起登录请求
    enterKeyUpLogin(e:any){
      if (e.keyCode === 13){
        this.loginAdmin(this.$refs.ruleForm,this.ruleForm.account,this.ruleForm.pass)
      }

    },
    isMobile(){
      let w = window.innerWidth;
      this.showFormPhone = w < 500;
    }
  },
  mounted() {
    this.isMobile()
    window.onresize = ()=>{
      this.isMobile()
    }
  }
})
</script>

<style scoped>
.mall-login-container{
  margin: 0 auto;
}
.mall-login-header-phone{
  display: none;
}
.mall-login-header{
  width: 100%;
  height: 14vh;
  line-height: 14vh;
  text-align: left;
  text-indent: 16vw;
  font-size: larger;
  font-weight: bolder;
  background-image: url("../assets/image/login/banner.jpeg");
}
.mall-login-main{
  width: 100%;
  height: 54vh;
  background-image: url("../assets/image/login/background.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
.mall-login-content{
  width: 100%;
}
.content-col{
  margin-left: 60%;
  min-width: 22rem;
  background-color: #fff;
}
.content-form{
  width: 100%;
  height: 100%;
}
.form-item{
  margin: 10% auto;
  width: 90%;
}
.login-button{
  width: 6rem;
}
.forget-password{
  margin-right:-10%;
  border: none;
  color: #00008b;
}
.forget-password:hover{
  background-color: transparent;
  text-decoration-line: underline;
}
.footer-row .el-col{
  margin: 8vh auto 0;
}
@media screen and (max-width: 500px){
  .mall-login-header-phone{
    position: absolute;
    left: -50%;
    width: 200px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    transform: translateY(100%) translateX(-50%);
  }
  .mall-login-header-phone-trans{
    left: 50%;
    transition: left .5s ease-in-out;
  }
  .mall-login-header{
    display: none;

  }
  .mall-login-main{
    padding: 0;
    height:100vh;
    background-image: url("../assets/image/login/bg.jpg");
  }
  .mall-login-main .mall-login-content{
    position: relative;
    top: 24%;
    width: 100vw;
    height: calc(100vh - 24vh);
    background-color: #fff;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    transform: translateY(100%);
  }
  .mall-login-main .mall-login-con-phone{
    transform: translateY(0);
    transition: transform .5s ease-in-out;
  }
  .mall-login-content .content-col{
    margin:  0 auto;
    width: 100%;
    background-color: transparent;
    color: #FFFFFF;
  }
  .mall-login-footer{
    display: none;
  }
  .form-item-btn{
    margin-right: 0;
    width: 80%;
    border-radius: 1rem;
  }
}
</style>
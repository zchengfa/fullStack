<template>
  <div class="register" v-if="isClose">
    <Close @close="closeCurrentPage"></Close>
    <form class="register-form">
      <div class="input-box">
        <input type="text" placeholder="手机号/QQ邮箱" @input="onChange" @blur="checkAccountIsEmpty" v-model="account" />
        <span class="error-msg" v-if="accountIsEmpty">您未输入账号</span>
        <input type="password" placeholder="密码:" @input="onChange" @blur="checkPassIsEmpty" v-model="password" />
        <span class="error-msg" v-if="passIsEmpty">您未输入密码</span>
        <input type="password" placeholder="确认密码:" @input="onChange" @blur="checkConPassIsEmpty" v-model="confirmPwd" />
        <span class="error-msg" v-if="conPassIsEmpty">请再一次输入密码</span>
        <div class="mail-verify" v-show="isMail">
          <div><input type="text" class="mail-code" @input="onChange" @blur="checkCodeIsEmpty" v-model="mailVerifyCode">
            <span class="error-msg" v-if="codeIsEmpty">您未输入验证码</span></div>
          <div>
            <button type="button" :class="{active: !isSendAgain}" @click="sendVerifyCode">
              <span v-if="!isSendAgain">发送验证码</span>
              <span v-else>重新发送<span v-show="verifyCodeExpired">({{verifyCodeExpired}})秒</span></span>
            </button>
          </div>
        </div>
      </div>
      <div class="button-box">
        <button :class="{active:!isAble}" type="button" @click="submitRegister">注册</button>
      </div>
      <div class="to-login">
        <span>已有账号?</span>
        <router-link class="login" :to="{path:'/login'}" replace>登录</router-link>
      </div>
    </form>
    <registration-agreement></registration-agreement>
  </div>
</template>

<script>
//引入close混入对象
import {closeCurrentPageMixins} from '@/common/mixins/mixins'

//引入密码加密模块
import {encrypt} from "@/common/crypt";

import {register,sendMailVerifyCode} from "@/network/home";

import RegistrationAgreement from "@/components/content/register/RegistrationAgreement";

export default {
  name: "Register",
  mixins:[closeCurrentPageMixins],
  data(){
    return {
      confirmPwd:'',
      isSendAgain:false,
      isMail:false,
      RegExpPhone:/^((13[0-9])|(15[^4])|(18[^4])|(199))\d{8}/,
      RegExpMail:/^[1-9]\d{7,10}@qq\.com/,
      mailVerifyCode:'',
      encryptPwd:'',
      encryptConfirmPwd:'',
      verifyCodeExpired: 0,
      accountIsEmpty:false,
      passIsEmpty:false,
      conPassIsEmpty:false,
      codeIsEmpty:false
    }
  },
  components:{
    RegistrationAgreement
  },
  methods:{
    checkAccountIsEmpty(){
      return this.accountIsEmpty = !this.account

    },
    checkPassIsEmpty(){
      return this.passIsEmpty = !this.password

    },
    checkConPassIsEmpty(){
      return this.conPassIsEmpty = !this.confirmPwd

    },
    checkCodeIsEmpty(){
      return this.codeIsEmpty = !this.mailVerifyCode

    },
    checkAllIsEmpty(){
      return !!(this.checkAccountIsEmpty() && this.checkPassIsEmpty() && this.checkConPassIsEmpty());
    },
    onChange(){
      this.encryptPwd = encrypt(this.password)
      this.encryptConfirmPwd = encrypt(this.confirmPwd)
      //判断账号类型，根据账号类型决定注册按钮能点击的条件
      if (this.adjustAccountType()) {
       this.changeDisabledStatus(this.account.length && this.password.length && this.confirmPwd.length && this.mailVerifyCode.length === 6)
      }
      else {
        this.changeDisabledStatus(this.account.length && this.password.length && this.confirmPwd.length)
      }

    },
    //检测参数真假，改变按钮的点击状态
    changeDisabledStatus(confident){
      this.isAble = !confident;
    },
    adjustAccountType() {
      //判断账号是否为QQ邮箱类型，若是则显示发送邮箱验证元素
      if (this.RegExpMail.test(this.account)) {
        this.isMail = true
        return true
      }
      else {
        this.isMail = false
        return  false
      }
    },
    //检测密码是否一致，长度是否达到要求
    verifyPass() {
      if (this.encryptPwd=== this.encryptConfirmPwd){
        if (this.password.length >=6) {
          return true
        }
        else {
          this.$toast.showToast('密码长度至少为6')
        }
      }
      else {
        this.$toast.showToast('两次密码不一致')
      }
    },
    submitRegister() {

      //先判断用户注册所用的账号是否为手机号或者qq邮箱
      if (this.RegExpPhone.test(this.account) || this.adjustAccountType()) {

        //若是手机号
        if (this.RegExpPhone.test(this.account)) {
          console.log(this.RegExpPhone.test(this.account),this.verifyPass(), this.checkAllIsEmpty())
          if (this.verifyPass()&& !this.checkAllIsEmpty()) {
            console.log(this.RegExpPhone.test(this.account))
            register(this.account,this.encryptPwd).then((res)=> {
              if (res.data.success) {
                console.log(this.RegExpPhone.test(this.account))
                //注册成功跳转页面
                this.$toast.showToast(res.data.success)
                this.$router.go(-1)
              }
              else {
                this.$toast.showToast(res.data.exist)
              }
            })
          }
        }
        //若是QQ邮箱
        else {
          if (this.verifyPass()&& !this.checkAllIsEmpty() && !this.checkCodeIsEmpty()) {
            register(this.account,this.encryptPwd,this.mailVerifyCode).then(res => {
              console.log(res)
              if (res.data.success) {
                //注册成功跳转页面
                this.$toast.showToast(res.data.success)
                this.$router.go(-1)
              }
              else if (res.data.code_err) {
                this.$toast.showToast(res.data.code_err)
              }
              else if (res.data.code_expired) {
                this.$toast.showToast(res.data.code_expired)
              }
              else {
                this.$toast.showToast(res.data.exist)
              }

            }).catch(err => {
              console.log(err)
            })
          }
        }
      }
      else {
        this.$toast.showToast('您的账号格式不正确')
      }

    },
    //给邮箱发送验证码,并将验证码赋值给mailVerifyCode，以便注册按钮可以接收到验证码后提交给后端进行校验
    sendVerifyCode() {

      sendMailVerifyCode(this.account).then(res => {
        console.log(res)
        this.isSendAgain = true
        if (res.data.email_non_exist) {
          this.$toast.showToast(res.data.email_non_exist,1000)
        }
        else if(res.data.verify_code_expired){
          this.verifyCodeExpired = res.data.verify_code_expired
          let timer = null
          console.log(this.verifyCodeExpired)
          timer = setInterval(() => {
            this.verifyCodeExpired --
            if (this.verifyCodeExpired <= 0) {
              clearInterval(timer)
              this.verifyCodeExpired = 0
            }
          },1000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.active {
  background-color: #e02929;
  border: none;
  color: #fff;
}
.register{
  position: relative;
  top:0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  max-width: var(--app-max-width);
  background-image: url("~assets/image/register/register_bg.png");
  background-size: cover;
  text-align: center;
  z-index: 12;
}
.register-form{
  margin: 0 auto;
  width: 80%;
  max-width: 400px;
  min-width: 360px;
  background-color: rgba(26, 25, 25, 0.5);
}
input{
  display: block;
  margin: 1rem auto;
  width: 80%;
  height: 2rem;
  color: #fff;
  background-color: transparent;
  border-bottom: 1px solid #fff;
  font-size: .9rem;
}
input::-ms-input-placeholder{
  color: #fff;
}
input::-webkit-input-placeholder{
  color: #fff;
}
.error-msg{
  display: block;
  margin-top: -1rem;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  color: #ee3e17;
  text-align: left;
}
button{
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 65%;
  height: 2rem;
  color: #fff;
  background-color: #2791d9;
  border-radius: 1rem;
}
.to-login {
  margin: 1rem auto;
  width: 90%;
  height: 2rem;
  text-align: right;
  line-height: 1.5rem;
  font-size: .9rem;
}
.to-login .login{
  display: inline-block;
  margin-left: .3rem;
  margin-right: .5rem;
  width: 3rem;
  height: 1.5rem;
  color: #fff;
  text-align: center;
  border-radius: .2rem;
  background-color: #e02929;
}
.to-login span{
  color: #1e8efc;
}
.mail-verify {
  display: flex;
  margin: 0 auto;
  width: 90%;
}
.mail-verify input {
  background-color: #ece6e6;
  border: 1px solid #a5a2a2;
  color: #d31313;
  font-weight: bolder;
}
.mail-verify div {
  flex: 1;
}
.mail-verify button {
  position: relative;
  top:5%;
  font-size: 12px;
  width: 70%;
  height: 40%;
  background-color: #e02929;
}
</style>
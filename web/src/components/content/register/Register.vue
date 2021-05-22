<template>
  <div class="register" v-if="isClose">
    <Close @close="closeCurrentPage"></Close>
    <form class="register-form">
      <div class="title"><h4>欢迎来到注册页面</h4></div>
      <div class="input-box">
        <input type="text" placeholder="手机号/QQ邮箱" @input="onChange" v-model="username" />
        <input type="password" placeholder="密码:" @input="onChange" v-model="password" />
        <input type="password" placeholder="确认密码:" @input="onChange" v-model="confirmPwd" />
        <div class="mail-verify" >
          <div><input type="text" class="mail-code" v-model="mailVerifyCode"></div>
          <div>
            <button @click="sendVerifyCode">
              <span v-if="!isSendAgain">发送验证码</span>
              <span v-else>重新发送</span>
            </button>
          </div>
        </div>
      </div>
      <div class="button-box">
        <button :class="{active:!isAble}" type="button" :disabled="isAble" @click="submitRegister">注册</button>
      </div>
      <div class="to-login">
        <span>已有账号?</span>
        <router-link class="login" :to="{path:'/login'}" replace>登录</router-link>
      </div>
    </form>
  </div>
</template>

<script>
//引入close混入对象
import {closeCurrentPageMixins} from '@/common/mixins/mixins'

//引入密码加密模块
import {encrypt} from "@/common/crypt";

import {register} from "@/network/home";

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
      mailVerifyCode:''
    }
  },
  methods:{
    onChange(){
      if (this.username.length && this.password.length && this.confirmPwd.length) {
        this.isAble = false
      }
      else {
        this.isAble=true
      }
      //判断账号是否为QQ邮箱类型，若是则显示发送邮箱验证元素
      if (this.RegExpMail.test(this.username)) {
        this.isMail = true
      }
      else {
        this.isMail = false
      }
    },
    submitRegister() {

      const encryptPwd = encrypt(this.password)
      const encryptConfirmPwd = encrypt(this.confirmPwd)

      //先判断用户注册所用的账号是否为手机号或者qq邮箱
      if (this.RegExpPhone.test(this.username) || this.RegExpMail.test(this.username)) {
        if (encryptPwd===encryptConfirmPwd){
          if (this.password.length >=6) {
            register(this.username,encryptPwd).then((res)=> {
              if (res.data.success) {
                //注册成功跳转页面
                this.$toast.showToast(res.data.success)
                this.$router.go(-1)
              }
              else {
                this.$toast.showToast(res.data.exist)
              }
            })
          }
          else {
            this.$toast.showToast('密码长度至少为6')
          }
        }
        else {
          this.$toast.showToast('两次密码不一致')
        }
      }
      else {
        this.$toast.showToast('您的账号格式不正确')
      }

    },
    //给邮箱发送验证码
    sendVerifyCode() {

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
  top:-1rem;
  width: 100vw;
  height: 100vh;
  background-color: #e78ba9;
  text-align: center;
  z-index: 12;
}
.register-form{
  position: relative;
  top:20%;
  margin: 0 auto;
  width: 80%;
  background-color: rgba(26, 25, 25, 0.5);
}
input{
  display: block;
  margin: 1rem auto;
  width: 85%;
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
button{
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 90%;
  height: 2rem;
  color: #fff;
  background-color: #c2bdbd;
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
}
.mail-verify div {
  flex: 1;
}
.mail-verify button {
  position: relative;
  top:5%;
  font-size: .8rem;
  width: 70%;
  height: 40%;
}
</style>
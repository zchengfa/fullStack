<template>
  <div class="login" v-if="isClose">
    <Close @close="closeCurrentPage"></Close>
    <div class="bg"></div>
    <form class="form" name="login">
      <div class="header">
        <img src="~assets/image/profile/header.png" alt="header_img">
      </div>
      <div class="content">
        <div class="input-box">
          <input type="text" placeholder="账号/手机号" @input="onChange" v-model="username"/>
          <input type="password" placeholder="密码" @input="onChange" v-model="password"/>
        </div>
        <div class="option">
          <input type="checkbox" @click="checkBox" id="remember" :checked="isChecked" :disabled="isAble" />
          <label for="remember">记住密码</label>
          <router-link class="register-link" :to="{path:'/register'}" replace>没有账号?去注册</router-link>
        </div>
        <button type="button" @click="login" :disabled="isAble" :class="{active:!isAble}">登录</button>
      </div>
      <div class="login-way" @click="loginWay">
        <div class="qq"><img src="~assets/image/login/QQ.svg" alt="QQ"><span>QQ登录</span></div>
        <div class="weChat"><img src="~assets/image/login/WeChat.svg" alt="WeChat"><span>微信登录</span></div>
      </div>
    </form>
  </div>
</template>

<script>
import {login} from "@/network/home";
import {setCookie} from "@/common/cookie";

//引入密码加密模块
import {encrypt} from '@/common/crypt'

import {closeCurrentPageMixins} from '@/common/mixins/mixins'

export default {
  name: "Login",
  mixins:[closeCurrentPageMixins],
  data(){
    return {
      isChecked:false
    }
  },
  methods:{
    onChange(){
      if (this.username.length && this.password.length){
        this.isAble = false
      }
      else {
        this.isAble = true
      }
    },
    login(){
      //对用户输入的密码进行加密
      const encryptPwd = encrypt(this.password)

      //将用户名和加密后的密码传给服务端进行校验
      login(this.username,encryptPwd).then(res => {
          console.log(res)

        //判断是否勾选记住密码项
          if (this.isChecked) {

            //记住密码进入勾选状态，设置cookie
            setCookie(this.username,encryptPwd,1)
          }
        //判断是否有token值
          if (res.data.token) {
            //登录成功，将token存储到sessionStorage临时存储中，页面关闭时会自动清除token
            sessionStorage.token = res.data.token

            //登录成功，跳转到profile页面
            this.$router.go(-1)
          }
          else {
            //登录失败，提示后端传过来的提示信息
            this.$toast.showToast(res.data.err)
          }
        }).catch(err => {
          console.log(err)
        })

    },
    checkBox(){
      if (Object.keys(this.username).length && Object.keys(this.password).length){
        this.isChecked = true
        this.isAble = false
      }
      else {
        this.isChecked = false
        this.isAble = true
      }
      console.log(document.cookie)
    },
    loginWay(){
      this.$toast.showToast('功能暂时还未开发')
    }
  },
  mounted() {
    if (sessionStorage.getItem('token')) {
      console.log(sessionStorage.getItem('token'))
    }
  }
}
</script>

<style scoped>
.active {
  background-color: #f31b1b;
  border: none;
  color: #fff;
}
.login{
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 12;
}
.bg{
  position: relative;
  width: 100%;
  height: 20vh;
  background-color: #5d5ddc;
}
.bg::after{
  position: absolute;
  top: 0;
  display: block;
  content: '';
  width: 100%;
  height: 36vh;
  border-radius: 50%;
  background-color: #5d5ddc;
}
.form{
  position: relative;
  margin: 20vh auto 1rem;
  width: 80vw;
  background-color: #fff;
  z-index: 9;
}
.header{
  position: absolute;
  top: -4rem;
  width: 100%;
  text-align: center;
}
.content{
  position: relative;
  top:1rem
}
input{
  display: block;
  margin-top: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  height: 2rem;
  outline: none;
  text-indent: 1rem;
  color: #aaa7a7;
  border-bottom: 1px solid #aaa7a7;
}
#remember{
  display: inline-block;
  margin-left: 10%;
  width: 1rem;
  height: 1rem;
}
label{
  position: relative;
  top: -.2rem;
  padding-left: .5rem;
  font-size: .6rem;
}
.register-link {
  position: relative;
  top: -2px;
  left: 30%;
  font-size: .8rem;
  color: deepskyblue;
}
button{
  display: block;
  margin: 1rem auto;
  width: 80%;
  height: 2rem;
  background-color: #c2bdbd;
  border-radius: 1rem;
  border: none;
  color: #fff;
  outline: none;
}
.login-way{
  position: relative;
  top: 1rem;
  display: flex;
  margin: auto;
  width: 80%;
  text-align: center;
}
.login-way div {
  flex: 1;
  font-size: .9rem;
}
.login-way img{
  display: block;
  position: relative;
  top: 0;
  left: 50%;
  width: 1.5rem;
  height: 1.5rem;
  background-size: contain;
  transform: translateX(-50%);
}
.login-way span {
  display: block;
  margin-top: .4rem;
}
</style>
<template>
  <div class="login" v-if="isClose">
    <Close @close="closeCurrentPage"></Close>
    <form class="form" name="login">
      <div class="content">
        <div class="input-box">
          <input type="text" placeholder="手机号/QQ邮箱" @blur="autoJoinPassword" @input="onChange" v-model="account"/>
          <input type="password" placeholder="密码" @input="onChange" v-model="password" autocomplete/>
        </div>
        <div class="option">
          <div class="remember-box">
            <input type="checkbox" @click="checkBox" id="remember" :checked="isChecked" :disabled="isAble" />
            <label for="remember">记住密码</label>
          </div>
          <router-link class="register-link" :to="{path:'/register'}" replace>没有账号?去注册</router-link>
        </div>
        <button type="button" class="login-button" @click="login" :disabled="isAble" :class="{active:!isAble}">登录</button>
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
import {getCookie, setCookie} from "@/common/cookie";

//引入密码加密模块
import {decrypt, encrypt} from '@/common/crypt'

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
      this.isAble = !(this.account.length && this.password.length);
    },
    autoJoinPassword(){
      let cookie = getCookie(this.account)
      if (cookie){
        this.password = decrypt(cookie.password)
        this.isAble = false
      }
    },
    login(){
      //对用户输入的密码进行加密
      const encryptPwd = encrypt(this.password)

      //将用户名和加密后的密码传给服务端进行校验
      login(this.account,encryptPwd).then(res => {
        console.log(decrypt(encryptPwd))
        //判断是否有token值,后端返回了token值，登录成功
          if (res.data.token) {
            //判断是否勾选记住密码项
            if (this.isChecked) {

              //记住密码进入勾选状态，设置cookie
              setCookie(this.account,encryptPwd,1)
            }
            //将token和用户信息分发给vuex进行状态管理
              this.$store.dispatch('userInfo',res.data.userInfo)
              this.$store.dispatch('setToken',JSON.parse(JSON.stringify(res.data.token)))
              //登录成功，跳转到之前页面
              this.$router.go(-1)
          }
          else if (res.data.non_exist) {
            //登录失败，提示后端传过来的提示信息
            this.$toast.showToast(res.data.non_exist)
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
      if (this.account.length && this.password.length){
        this.isChecked = true
        this.isAble = false
      }
      else {
        this.isChecked = false
        this.isAble = true
      }
    },
    loginWay(){
      this.$toast.showToast('功能暂时还未开发')
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.active {
  background-color: #f31b1b !important;
  border: none;
}
.login{
  display: flex;
  position: absolute;
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~assets/image/login/login_bg.png");
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: .9rem;
  z-index: 10;
}
.login .form{
  width: 90%;
  height: 40%;
  min-height: 18rem;
  text-align: center;
  background: rgba(83, 76, 76, 0.3);
}
.input-box input{
  position: relative;
  margin-top:1rem;
  width: 80%;
  height: 2.2rem;
  background: transparent;
  border: 1px solid #d7c5c5;
  color: #fff;
}
.input-box input::placeholder{
  color: #fff;
}
.option{
  margin: 1rem auto 0;
  width: 80%;
}
.remember-box{
  display: inline-block;
  width: 50%;
  text-align: left;
}
.register-link{
  color: #1e8efc;
}
.login-way{
  display: flex;
  margin-top: 1.5rem;
}
.login-way div{
  flex: 1;
}
.login-way span{
  position: relative;
  display: inline-block;
  top: -.5rem;
  width: 50%;
  text-align: left;
}
.login-way img{
  width: 1.5rem;
  height: 1.5rem;
}
.login-button{
  position: relative;
  margin-top: 1rem;
  width: 60%;
  height: 2.2rem;
  border-radius: 1rem;
  background-color: #3b75d9;
  color: #fff;
}
</style>
<template>
  <div class="login" v-if="isClose">
    <Close @close="closeCurrentPage"></Close>
    <img src="~assets/image/login/login_bg.jpeg" class="login-bg" alt="bg">
    <div class="form-box">
      <form class="form-com" name="login">
        <div class="avatar-mark"><img class="avatar" src="~assets/image/login/avatar.jpg" alt="avatar_default"></div>
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
        console.log(res)
        //判断是否有token值,后端返回了token值，登录成功
          if (res.data.Access_token) {
            //判断是否勾选记住密码项
            if (this.isChecked) {

              //记住密码进入勾选状态，设置cookie
              setCookie(this.account,encryptPwd,1)
            }
            //将token和用户信息分发给vuex进行状态管理
              this.$store.dispatch('userInfo',res.data.userInfo)
              this.$store.dispatch('setToken',JSON.stringify({
                Access_token:res.data.Access_token,
                Refresh_token:res.data.Refresh_token
              }))
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
    console.log(this.$route)
  }
}
</script>

<style scoped>
.active{
  background-color: #0d84ff !important;
}
.login{
  width: 100%;
  height: 100%;
  text-align: center;
  vertical-align: middle;
}
.login{
  position: relative;
  z-index: 999;
}
.login-bg{
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(5px);
}
.avatar-mark{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 50%;
  width: 5rem;
  height: 5rem;
  background-color: #fff;
  border-radius: 50%;
  transform: translate(-50% ,-50%);
  box-shadow: rgba(0,0,0,.1) 2px 2px 10px;
}
.avatar{
  width:80%;
  height: 80%;
  border-radius: 50%;
}
.form-box{
  position: absolute;
  top:50%;
  left: 50%;
  width: 84%;
  transform: translate(-50% ,-50%);
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: rgba(0,0,0,.5) 10px 10px 10px;
}
.form-com{
  padding: 2rem;
}
input[type=text],input[type=password]{
  margin-top: 1rem;
  width: 100%;
  height: 2rem;
  border-bottom: 1px solid #8a8a8a;
}
input[type=password]{
  margin-bottom: 1rem;
}
.option{
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
}
.option .remember-box{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.remember-box #remember{
  margin-right: 4px;
}
.register-link{
  color: #0d84ff;
}
.login-button{
  margin: 1rem 0;
  width: 60%;
  height: 2rem;
  background-color: #ff0d62;
  border-radius: 1rem;
  color: #fff;
}
.login-way,.qq,.weChat{
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
}
.login-way img{
  transform: scale(.7);
}
</style>
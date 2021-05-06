<template>
  <div class="login">
    <div class="bg"></div>
    <form class="form" name="login">
      <div class="header">
        <img src="~assets/image/profile/header.png" alt="header_img">
      </div>
      <div class="content">
        <input type="text" placeholder="账号/手机号" @input="onChange" v-model="username">
        <input type="password" placeholder="密码" @input="onChange" v-model="password">
        <input type="checkbox" @click="checkBox" id="remember" :checked="isChecked" :disabled="isAble" >
        <label for="remember">记住密码</label>
        <button type="submit" @click="login" :disabled="isAble" :class="{active:!isAble}">登录</button>
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
import {setCookie,getCookie} from "@/common/cookie";

export default {
  name: "Login",
  data(){
    return {
      username:'',
      password:'',
      isChecked:false,
      isAble:true
    }
  },
  methods:{
    onChange(){
      if (this.username.length !==0 && this.password.length !==0){
        this.isAble = false
      }
      else {
        this.isAble = true
      }
    },
    login(){
      login(this.username,this.password).then(res => {
        console.log(res)
        if (Object.keys(res).length !==0) {
          sessionStorage.token = res.data.token
          this.$router.replace('/profile')
        }
        else {
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
        //用户名和密码都不为空，设置cookie
        setCookie(this.username,this.password,1)

      }
      else {
        this.isChecked = false
        this.isAble = true
        this.$toast.showToast('账号或密码不能为空',500)
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
  width: 100vw;
  height: 100vh;
  background-color: #fff;
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
  color: darkgrey;
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
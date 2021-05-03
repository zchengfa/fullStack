<template>
  <div class="login">
    <div class="bg"></div>
    <form class="form">
      <div class="header">
        <img src="~assets/image/profile/header.png" alt="header_img">
      </div>
      <div class="content">
        <input type="text" placeholder="账号/手机号" @input="onChange" v-model="username">
        <input type="password" placeholder="密码" @input="onChange" v-model="password">
        <input type="checkbox" @click="checkBox" id="remember" :checked="isChecked" :disabled="isAble" >
        <label for="remember">记住密码</label>
        <button type="submit" @click="login">登录</button>
      </div>
      <div class="login-way">
        <div class="qq"><img src="" alt="">QQ登录</div>
        <div class="weChat"><img src="" alt="">微信登录</div>
      </div>
    </form>
  </div>
</template>

<script>
import {login} from "@/network/home";
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
      if (this.username.length && this.password.length){
        this.isAble = false
      }
      console.log(this.username,this.password)
    },
    login(){
      login(this.username,this.password).then(res => {
        console.log(res)
      })
    },
    checkBox(){
      if (Object.keys(this.username).length && Object.keys(this.password).length){
        this.isChecked = true
        this.isAble = false
        this.setCookie(this.username,this.password,1)
      }
      else {
        this.isChecked = false
        this.isAble = true
        this.$toast.showToast('账号或密码不能为空',500)
      }
      console.log(this.isChecked,this.isAble,document.cookie)
    },
    setCookie(username,password,expiresTime){
      let date = new Date()
      date.setTime(date.getTime()+(expiresTime *24 *60 *60 *1000))
      let expires = 'expires='+ date.toUTCString()
      document.cookie = username + '=' +password + ';' +expires
    }
  }
}
</script>

<style scoped>
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
  background-color: #f31b1b;
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
}
.login-way div {
  flex: 1;
  font-size: .8rem;
}
</style>
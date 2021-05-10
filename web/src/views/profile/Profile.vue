<template>
  <div class="profile">
    <nav-bar>
      <div slot="left"><img src="~assets/image/detail/back.svg" alt="back"></div>
      <div slot="right"><img src="~assets/image/profile/config.png" alt="config"></div>
    </nav-bar>
    <div class="user-info">
      <div class="info" v-if="isLogin">
        <div class="user-header-default" v-if="hasHeader">
          <img src="~assets/image/profile/header_default.png" alt="header_default">
        </div>
        <div class="user-header-custom" v-else>
          <img :src="headerCustom" alt="header_custom">
        </div>
        <div class="username"><span>欢迎您,{{username}}</span></div>
      </div>
      <div class="login-register" v-else>
        <button class="register" @click="register">注册</button>
        <button class="login" @click="login">登录</button>
      </div>
      <div class="collection">
        <a href="javascript:void (0)" class="collection-item"  v-for="(item, index) in collectionList" :key="index">
          <span class="count">{{item.count}}</span>
          <span class="title">{{item.title}}</span>
        </a>
      </div>
    </div>
    <menu-list :menu-list="orderList"></menu-list>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import MenuList from "@/components/content/menuList/MenuList";

import {getProfileData} from "@/network/profile";

import jwt from 'jsonwebtoken'

export default {
  name: "Login",
  data(){
    return {
      collectionList:[
        {
          "count":"--",
          "title":"商品收藏"
        },
        {
          "count":"--",
          "title":"品牌收藏"
        },
        {
          "count":"--",
          "title":"我的足迹"
        }
      ],
      orderList: [],
      isLogin:false,
      username:'',
      headerCustom:'',
      hasHeader:true
    }
  },
  components:{
    NavBar,
    MenuList
  },
  methods:{
    getProfileData(){
      getProfileData().then()
          .catch(err => {
            console.log(err)
          })
    },
    login(){
      this.$router.push('/login')
    },
    register(){
      this.$router.push('/register')
    }
  },
  created() {
    this.getProfileData()
  },
  activated() {
    const token = sessionStorage.getItem('token')
    jwt.verify(token,'user', (err, decode) => {
      if (err) throw err
      else {
        if (decode) {
          this.isLogin = true
          this.username = decode.username
          if (decode.headerImage) {
            this.hasHeader = false
            this.headerCustom = decode.headerImage
          }
          else {
            this.hasHeader = true
          }
        }
      }
    })

    //console.log(decode)
  }
}
</script>

<style scoped>
.profile{
  width: 100vw;
  height: 100vh;
  background-color: #dad5d5;
}
.profile div{
  background-color: #fff;
}
.user-info {
  width: 100%;
  height: 20vh;
}
.user-info .info{
  width: 100%;
  text-align: center;
}
.login-register{
  position: relative;
  top:1rem;
  bottom:1rem;
  text-align: center;
}
.login,.register{
  width: 5rem;
  height: 2rem;
  border:1px solid #e02929;
  border-radius: 1rem;
  color: #e02929;
}
.register{
  margin-right: 1rem;
}
.login{
  background-color: #e02929;
  color: #fff;
}
.collection{
  display: flex;
  position: relative;
  top:2rem;
  text-align: center;
  font-size: .8rem;
  line-height: 1.5rem;
}
.collection a{
  flex: 1;
  margin-bottom: .5rem;
}
.collection span{
  display: block;
  height: 1.5rem;
}
.collection .title::before{
  position: relative;
  right: 32%;
  display: inline-block;
  content: '|';
  color: #bfbaba;
}
</style>

<template>
  <div class="profile">
    <nav-bar class="nav">
      <div slot="center">我的</div>
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
        <a href="javascript:void (0)" class="collection-item"  v-for="(item, index) in userInfoList" :key="index">
          <span class="count">{{item.count}}</span>
          <span class="title">{{item.title}}</span>
        </a>
      </div>
    </div>
    <order-menu :order-list="orderList"></order-menu>
    <order-menu :order-list="meansList"></order-menu>
    <menu-list class="other-menu" :menu-list="otherList" :padding="true"></menu-list>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import OrderMenu from "@/components/content/orderMenu/OrderMenu";
import MenuList from "@/components/content/menuList/MenuList";

import {getUserInfo} from "@/network/profile";

import {orderMenuImage,meansMenuImage,otherMenuImage} from '@/assets/image/profile/orderMenu/orderMenuImage'

import {verify} from '@/common/jsonwebtoken'

export default {
  name: "Login",
  data(){
    return {
      userInfoList:[
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
      meansList:[],
      otherList:[],
      isLogin:false,
      username:'',
      headerCustom:'',
      hasHeader:true,
      token:sessionStorage.getItem('token')
    }
  },
  components:{
    NavBar,
    OrderMenu,
    MenuList
  },
  methods:{
    getUserInfo(username,user_id){
      getUserInfo(username,user_id).then(res => {
        console.log(res)
        if (res.data.header_image) {
          this.hasHeader = false
          this.headerCustom = res.data.header_image
        }
        else {
          this.hasHeader = true
        }
      })
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
    this.otherList = otherMenuImage
    this.meansList = meansMenuImage
    this.orderList = orderMenuImage
  },
  mounted() {
    if (this.token) {
      verify(this.token, (err, decode) => {
        if (err) throw err
        else {
          console.log(decode)
          if (decode) {
            this.isLogin = true
            this.username = decode.username
            this.getUserInfo(this.username,decode.user_id)
          }
        }
      })
    }
    else {
      console.log('用户未登录')
    }
  }
}
</script>

<style scoped>
.profile{
  width: 100vw;
  height: 100vh;
  background-color: #efecec;
}
.profile div{
  background-color: #fff;
}
.nav {
  box-shadow: 0 1px #ece6e6;
}

.user-info {
  width: 100%;
  height: 24vh;
}
.user-info .info{
  position: relative;
  top: 1rem;
  text-align: center;
}
.user-header-custom img,
user-header-default img{
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-size: contain;
  overflow: hidden;
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
.other-menu {
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1rem;
  padding-bottom: 2rem;
  width: 96vw;
  border-radius: .5rem;
}

</style>

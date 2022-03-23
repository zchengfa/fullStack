<template>
  <div class="profile">
    <nav-bar class="nav">
      <div slot="center">我的</div>
    </nav-bar>
    <div class="user-info">
      <div class="info" v-if="isLogin">
        <div @click="lookInformation" class="user-header-default user-header" v-if="!hasHeader">
          <img src="~assets/image/profile/header.png" alt="header_default">
        </div>
        <div @click="lookInformation" class="user-header-custom user-header" v-else>
          <img :src="headerCustom" alt="header-image" title="header-image">
        </div>
        <div class="username" v-if="username"><span>{{username}}</span></div>
        <div class="account" v-else><span>{{account}}</span></div>
      </div>
      <div class="login-register" v-else>
        <button class="register" @click="register">注册</button>
        <button class="login" @click="login">登录</button>
      </div>
      <div class="collection">
        <a :href="RouterList[0]" class="collection-item"  v-for="(item, index) in userInfoList" :key="index">
          <span class="count" v-if="!isLogin">--</span>
          <Bubble :count="item.count" v-else></Bubble>
          <span class="title">{{item.title}}</span>
        </a>
      </div>
    </div>
    <order-menu :order-list="order_list"></order-menu>
    <means-menu :means-list="means_list"></means-menu>
    <menu-list @contactCustomer="contactCustomer"  class="other-menu" :menu-list="other_list"></menu-list>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import Bubble from "@/components/common/bubble/Bubble";
import OrderMenu from "@/components/content/orderMenu/OrderMenu";
import MenuList from "@/components/content/menuList/MenuList";
import MeansMenu from "@/components/content/meansMenu/MeansMenu";

import {getUserInfo} from "@/network/profile";

import base64 from '@/assets/image/base64/base64.json'
import {contactCustomerMixins} from "@/common/mixins/mixins";


export default {
  name: "Login",
  mixins:[contactCustomerMixins],
  data(){
    return {
      userInfoList:[
        {
          'title':'商品收藏'
        },
        {
          'title':'品牌收藏'
        },
        {
          'title':'我的足迹'
        }
      ],
      RouterList:['/productCollection'],
      order_list:{},
      means_list:{},
      other_list:{},
      isLogin:false,
      username:'',
      account:'',
      headerCustom:'',
      hasHeader:true
    }
  },
  components:{
    NavBar,
    OrderMenu,
    MenuList,
    MeansMenu,
    Bubble
  },
  methods:{
    getUserCollectionInfo(user_id){
      getUserInfo(user_id).then(res => {
        this.userInfoList = res.data.content
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
    },
    lookInformation(){
      this.$router.push('/userInformation')
    },
    // //接收子组件发出的联系客服事件
    // contactCustomer(){
    //   console.log('contactCustomer')
    // }
  },
  created() {
    if ( Object.keys(base64).length){
      this.order_list = base64.order_list
      this.means_list = base64.means_list
      this.other_list = base64.other_list
    }

    if (this.$store.state.token) {
      const userInfo = this.$store.state.userInfo
      this.isLogin = true
      this.username = userInfo.username
      this.account = userInfo.account

      //当userInfo中的头像为null时说明用户没有头像，显示默认头像，反之则显示用户自己的头像
      if (userInfo.avatar) {
        this.hasHeader = true
        this.headerCustom = userInfo.avatar
      }
      else {
        this.hasHeader = false
      }
      this.getUserCollectionInfo(userInfo.user_id)
    }
    else {
      console.log('用户未登录')
    }
  },
  mounted() {

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
.user-info{
  width: 100%;
  height: 10rem;
  text-align: center;
}
.user-info .login-register,
.user-info .collection{
  width: 100%;
  height: 50%;
  line-height: 5rem;
}
.user-info .login-register button{
  width: 22%;
  height: 2rem;
  border-radius: 1rem;
  color: #fff;
}
.user-info .login-register button.login{
  margin-left: 1rem;
  background-color: red;
}
.user-info .login-register button.register{
  background-color: #156fe3;
}
.user-info .collection{
  position: relative;
  display: flex;
}
.user-info .collection .collection-item{
  position: relative;
  flex: 1;
}
.collection-item span{
  display: block;
  width: 100%;
}
.collection-item span.count{
  position: relative;
  top: .5rem;
  height: 30%;
  line-height: 2rem;
  color: #d94141;
}
.collection-item span.title{
  height: 60%;
  line-height: 3rem;
}
.user-info .info{
  display: flex;
  width: 100%;
  height: 50%;
  line-height:5rem;
  text-align: center;
}
.info img{
  position: relative;
  top:1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}
.info span{
  display: block;
  width: 100%;
  height: 100%;
}
.info .user-header{
  flex:3;
}
.info .account,
.info .username{
  flex: 9;
  text-align: left;
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

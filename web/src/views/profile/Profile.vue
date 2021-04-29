<template>
  <div class="profile">
    <nav-bar>
      <div slot="left"><img src="~assets/image/detail/back.svg" alt="back"></div>
      <div slot="right"><img src="~assets/image/profile/config.png" alt="config"></div>
    </nav-bar>
    <div class="user-info">
      <div class="login-register">
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
      orderList: []
    }
  },
  components:{
    NavBar,
    MenuList
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

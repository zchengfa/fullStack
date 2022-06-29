<template>
  <div class="user-information">
    <nav-bar class="nav">
      <div slot="left" @click="back" class="back">
        <img src="~assets/image/detail/back.svg" alt="back">
      </div>
      <div slot="center">
        <span>个人资料</span>
      </div>
    </nav-bar>
    <div class="info">
      <div class="header">
        <span>头像</span>
        <img class="right" src="~assets/image/profile/right.png" alt="">
        <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="header">
        <img v-else src="~assets/image/profile/header.png" alt="header">
      </div>
      <div class="nick-name">
        <span>昵称</span>
        <img class="right" src="~assets/image/profile/right.png" alt="">
        <span v-if="userInfo.username">{{userInfo.username}}</span>
        <span v-else>mall商城会员</span>
      </div>
      <div class="gender">
        <span>性别</span>
        <img class="right" src="~assets/image/profile/right.png" alt="">
        <span v-if="userInfo.gender===0">女</span>
        <span v-else>男</span>
      </div>
      <div class="address" @click="address">
        <span>收货地址</span>
        <img class="right" src="~assets/image/profile/right.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
export default {
  name: "User",
  components:{
    NavBar
  },
  data(){
    return {
      userInfo:''
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    address(){
      //进入地址管理页面
      this.$router.push('/manageAddress')
    }
  },
  created() {
    this.userInfo = this.$store.state.userInfo
  }
}
</script>

<style scoped>
.user-information{
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #eeeaea;
  z-index: 11;
}
.nav{
  align-items: center;
  justify-items: center;
  border-bottom: 1px solid #c5b9b9;
}
.nav,.info{
  background-color: #fff;
}
.nav img{
  width: 2rem;
  margin-top: 25%;
  transform: translateY(-25%);
}
img{
  width: 3rem;
  border-radius: 1.5rem;
}
.info{
  margin-top: .5rem;
}
.info div{
  height: 3rem;
  border-bottom: 1px solid #d9d3d3;
  line-height: 3rem;
  font-size: .9rem;
}
.info div.header{
  position: relative;
  height: 4rem;
  line-height: 4rem;
}
.info div.header span{
  float: left;
}
.info div.header img{
  float: right;
  margin-right: 0;
  margin-top: .5rem;
}
.info div span:first-child{
  float: left;
  margin-left: 1rem;
  color: #000;
}
.info div span{
  float: right;
  margin-right: 0;
  color: #8a8686;
}
.right{
  float: right;
  margin-right: 0;
  margin-top: .5rem;
  width: 2rem;
}
.info div.header .right{
  margin-top: 1rem;
}
</style>
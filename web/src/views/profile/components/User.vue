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
      <div class="header" @click="changeHeader">
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
    },
    changeHeader(){
      let avatar = this.userInfo.avatar
      if (!avatar){
        avatar = 'data:image/png;base64,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'
      }
      this.$router.push({name:'avatar',params:{avatar}})
      //his.$toast.showToast('换头像功能暂未完善！',2000)
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
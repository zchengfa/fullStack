<template>
<div class="customer">
  <nav-bar class="nav">
    <div slot="left" @click="back"><img src="~assets/image/detail/back.svg" alt="backImage"></div>
    <div slot="center">客服</div>
  </nav-bar>
  <div class="message-box">
    <div class="message-user message" v-show="messageUserList.length" v-for="(item,index) in messageUserList" :key="index + 'user'">{{item}}</div>
    <div class="message-customer message" v-show="messageCustomerList" v-for="(items,index) in messageCustomerList" :key="index +'customer'">{{items}}</div>
  </div>
  <div class="bottom">
    <chat-bar @sendMessage="sendMessage"></chat-bar>
  </div>
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import ChatBar from "@/components/content/customer/ChatBar";
export default {
  name: "Customer",
  data(){
    return {
      messageUserList:[],
      messageCustomerList:[]
    }
  },
  components:{
    NavBar,
    ChatBar
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    sendMessage(message) {
      this.messageUserList.push(message)
    }
  },
  created() {
    console.log(this.$route.params.token)
  }
}
</script>

<style scoped>
.customer {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 10;
}
.nav {
  border-bottom: 1px solid #cdc9c9;
}
.nav div {
  font-weight: bolder;
  font-size: 1rem;
}
.nav div img{
  position: relative;
  top:5px;
}
.message-box {
  position: fixed;
  top:45px;
}
.message {
  padding: .5rem;
  background-color: #8ec225;
}
.message-user {

}
.message-customer{

}
.bottom {
  position: fixed;
  bottom: 0;
}
</style>
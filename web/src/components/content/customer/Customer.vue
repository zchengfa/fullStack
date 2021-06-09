<template>
<div class="customer">
  <nav-bar class="nav">
    <div slot="left" @click="back"><img src="~assets/image/detail/back.svg" alt="backImage"></div>
    <div slot="center">客服</div>
  </nav-bar>
  <div class="message-box">
   <Scroll class="content" ref="message" :padding="true">
     <div class="message" :class="{'message-user':item.sender==='user','message-customer':item.sender==='customer'}"
          v-for="(item,index) in messageList" :key="index"><span>{{item.message}}</span></div>
   </Scroll>
  </div>
  <div class="bottom">
    <chat-bar @sendMessage="sendMessage" @keyUpEnter="keyUpEnter" ></chat-bar>
  </div>
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import ChatBar from "@/components/content/customer/ChatBar";
import Scroll from "@/components/common/scroll/Scroll";

import io from 'socket.io-client'
export default {
  name: "Customer",
  data(){
    return {
      messageList:[]
    }
  },
  components:{
    NavBar,
    ChatBar,
    Scroll
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    scrollToBottom(){
      const scrollHeight = this.$refs.message.scroll.content.clientHeight
      const clientHeight = this.$refs.message.$el.clientHeight

      if (clientHeight<scrollHeight){
        this.$refs.message.scroll.scrollTo(0,- (scrollHeight + 300),300)
        //自动上滑后刷新scroll组件
        this.$refs.message.scroll.refresh()
      }
    },
    sendMessage(message) {
      const socket = io('http://192.168.1.103:3000')
      socket.emit('send',message)
      this.messageList.push({
        'sender':'user',
        message
      })
      this.scrollToBottom()
      socket.on('response',data => {
        this.messageList.push({
          'sender':'customer',
          'message':data.message
        })
        this.scrollToBottom()
      })

    },
    keyUpEnter(message){
      this.sendMessage(message)
    }
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
  position: fixed;
  top:0;
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
.content {
  width: 100vw;
  height: 100%;
  overflow: hidden;
}
.message-box {
  position: relative;
  top:44px;
  height: calc(100vh - 44px - 4rem);
}
.message {
  max-width: 90vw;
  margin-top: .5rem;
  margin-bottom: .5rem;
  padding: .5rem;
}
.message span {
  display: inline-block;
  padding: 1rem;
  max-width: 80%;
  border-radius: .4rem;
  word-break: break-all;
  text-align: left;
}
.message-user{
  text-align: right;
}
.message-user span{
  background-color: red;
}
.message-user::after {
  position: relative;
  top:50%;
  display: inline-block;
  content: '';
  border-width: .8rem;
  border-style: solid;
  border-color: transparent transparent transparent red;
}
.message-customer{
  text-align: left;
}
.message-customer span {
  background-color: #1e8efc;
}
.message-customer::before{
  position: relative;
  top:50%;
  display: inline-block;
  content: '';
  border-width: .8rem;
  border-style: solid;
  border-color: transparent #1e8efc transparent transparent;
  transform: translateY(-50%);
}
.bottom {
  position: fixed;
  bottom: 0;
}
</style>
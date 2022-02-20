<template>
  <div class="customer">
    <nav-bar class="nav">
      <div slot="left" @click="back"><img src="~assets/image/detail/back.svg" alt="backImage"></div>
      <div slot="center">客服</div>
    </nav-bar>
    <div class="message-box">
      <Scroll class="content" ref="message" :padding="true">
        <div class="content-box" :class="{'content-sender':item.sender===user,'content-receiver':item.sender==='customer'}" v-for="(item,index) in messageList" :key="index">
          <div class="message" :class="{'message-sender':item.sender===user,'message-receiver':item.sender==='customer'}">
            <span>{{item.message}}</span>
          </div>
          <img v-if="item.sender===user" :class="{'sender-image':item.sender===user}" :src="avatar"  alt="sender_image">
          <img v-else :class="{'rec-image':item.sender==='customer'}" :src="base64Json['customer_avatar_default']"  alt="rec_image">
        </div>
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
import base64Json from '@/assets/image/base64/base64.json'
import {getCusInfo} from "@/network/home";

import io from 'socket.io-client'
export default {
  name: "Customer",
  data(){
    return {
      messageList:[],
      url:this.$link,
      token:this.$store.state.token,
      user:'',
      socket:null,
      sender:null,
      avatar: '',
      base64Json:{},
      receiver:null
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

      if (clientHeight<=scrollHeight){
        this.$refs.message.scroll.scrollTo(0,- (scrollHeight + 300),300)
        //自动上滑后刷新scroll组件
        this.$refs.message.scroll.refresh()
      }
    },
    //获取客服信息
    getCustomerInfo(){
      getCusInfo().then(res=>{
        res.data['customer_info']?this.receiver=res.data['customer_info'].account:null
      }).catch(err=>{
        console.log(err)
      })
    },
    //发送消息
    sendMessage(message) {
      let sendTime = new Date().getTime()
      try {
        this.socket.emit('sendMsg',message,this.sender,this.receiver,sendTime);
      }
      catch (err) {
        console.log(err)
      }
      finally {
        this.messageList.push({
          message,
          'sender':this.sender,
          'sendTime':sendTime
        })

        this.scrollToBottom()
        console.log('message send success')
      }
    },
    //接收消息
    receiveMsg() {
      try {
        this.socket.on('receiveMessage',(message,sender) => {
          console.log(message,sender)
          this.sender = sender
          this.messageList.push({
            message,
            sender:'customer'
          })
          this.scrollToBottom()
        })
      }
      catch (err) {
        console.log(err)
      }
      finally {
        this.scrollToBottom()
      }
    },
    keyUpEnter(message){
      this.sendMessage(message)
    }
  },
  created() {
    this.getCustomerInfo()
    this.base64Json = base64Json
    if (this.token){
      let userInfo = this.$store.state.userInfo
      userInfo.username?this.user=userInfo.username:this.user=userInfo.account
      this.sender = this.user

      if (userInfo.avatar !== null){
        this.avatar = userInfo.avatar
      }
      else {
        userInfo.gender===0?this.avatar=this.base64Json['man_avatar_default']:this.avatar=this.base64Json['woman_avatar_default']
      }

      this.socket = io(this.url)

    }
  },
  mounted() {
    //通知服务器用户上线了
    this.socket.emit('online',this.user)
    this.receiveMsg()
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
.content-box{
  position: relative;
}
.content-box img{
  width: 10vw;
  height: 10vw;
}
.message {
  display: inline-block;
  max-width: 80%;
  margin-top: .5rem;
  margin-bottom: .5rem;
  padding: .5rem 0;
}
.message span {
  display: inline-block;
  padding: 1rem;
  max-width: 80%;
  border-radius: .4rem;
  word-break: break-all;
  text-align: left;
}
.content-sender{
  text-align: right;
  margin-right: 2vw;
}
.message-sender span{
  background-color: red;
}
.message-receiver {
  margin-left: 10%;
}
.message-sender::after,
.message-receiver::before{
  position: relative;
  top:50%;
  display: inline-block;
  content: '';
  border-width: .8rem;
  border-style: solid;
}
.message-sender::after {
  border-color: transparent transparent transparent red;
}
.content-receiver{
  text-align: left;
}
.content-customer img {
  position: absolute;
  left: 2vw;
  top:50%;
  transform: translateY(-50%);
}
.message-customer span {
  background-color: #1e8efc;
}
.message-receiver::before{
  border-color: transparent #1e8efc transparent transparent;
}
.bottom {
  position: fixed;
  bottom: 0;
}
</style>
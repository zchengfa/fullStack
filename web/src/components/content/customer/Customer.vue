<template>
  <div class="customer">
    <nav-bar class="nav">
      <div slot="left" @click="back"><img src="~assets/image/detail/back.svg" alt="backImage"></div>
      <div slot="center">客服</div>
    </nav-bar>
    <div class="message-box">
      <Scroll class="content" ref="message" :padding="true">
        <div class="content-box" :class="{'content-user':item.sender===user,'content-customer':item.sender==='customer'}" v-for="(item,index) in messageList" :key="index">
          <div class="message" :class="{'message-user':item.sender===user,'message-customer':item.sender==='customer'}">
            <span>{{item.message}}{{item.sendTime}}</span>
          </div>
          <img v-if="item.sender===user" :class="{'user-image':item.sender===user}" :src="avatar"  alt="image">
          <img v-else :class="{'customer-image':item.sender==='customer'}" src="~assets/image/profile/header.png"  alt="image">
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

import {verify} from "@/common/jsonwebtoken";

import io from 'socket.io-client'
export default {
  name: "Customer",
  data(){
    return {
      messageList:[],
      url:this.$link,
      token:sessionStorage.getItem('token'),
      user:'',
      socket:'',
      sender:'18270014304',
      avatar: ''
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
    //发送消息
    sendMessage(message) {
      let sendTime = new Date().getTime()
      try {
        this.socket.emit('sendMsg',message,this.user,this.sender,sendTime);
      }
      catch (err) {
        console.log(err)
      }
      finally {
        this.messageList.push({
          message,
          'sender':this.user,
          'sendTime':sendTime
        })
        this.scrollToBottom()
        console.log('message send success')
      }
    },
    //接收消息
    receiveMsg() {
      try {
        this.socket.on('sendMsgToReceiver',(message,sender) => {
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
    verify(this.token,(err,decode) => {
      if (err) throw err
      else {
        this.user = decode.username

        if (decode.avatar !== null){
          this.avatar = decode.avatar
        }
        else {
          this.avatar = '~assets/image/profile/header.png'
        }
        const  socket = io(this.url)
        this.socket = socket
      }
    })
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
.content-user{
  text-align: right;
  margin-right: 2vw;
}
.message-user span{
  background-color: red;
}
.message-customer {
  margin-left: 10%;
}
.message-user::after,
.message-customer::before{
  position: relative;
  top:50%;
  display: inline-block;
  content: '';
  border-width: .8rem;
  border-style: solid;
}
.message-user::after {
  border-color: transparent transparent transparent red;
}
.content-customer{
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
.message-customer::before{
  border-color: transparent #1e8efc transparent transparent;
}
.bottom {
  position: fixed;
  bottom: 0;
}
</style>
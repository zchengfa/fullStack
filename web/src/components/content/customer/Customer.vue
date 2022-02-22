<template>
  <div class="customer">
    <nav-bar class="nav">
      <div slot="left" @click="back"><img src="~assets/image/detail/back.svg" alt="backImage"></div>
      <div v-if="$store.state.userInfo.identity!==1000" slot="center">客服</div>
      <div v-else slot="center">{{$route.params.receiver}}</div>
    </nav-bar>
    <div class="message-box">
      <Scroll class="content" ref="message" :padding="true">
        <div class="content-box" :class="{'content-sender':item.sender===sender,'content-receiver':item.sender!==sender}" v-for="(item,index) in messageList" :key="index">
          <div class="message" :class="{'message-sender':item.sender===sender,'message-receiver':item.sender!==sender}">
            <span>{{item.message}}</span>
          </div>
          <img v-if="item.sender===user" :class="{'sender-image':item.sender===sender}" :src="item.avatar"  alt="sender_image">
          <img v-else :class="{'rec-image':item.sender!==sender}" :src="item.avatar"  alt="rec_image">
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
      receiver:null,
      userInfo:this.$store.state.userInfo
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
    initData(){
      this.base64Json = base64Json
      if (this.token){
        let userInfo = this.userInfo
        userInfo.username?this.user=userInfo.username:this.user=userInfo.account
        this.sender = this.user
        this.receiver = this.$route.params.receiver

        if (userInfo.identity!==1000){
          if (userInfo.avatar !== null){
            this.avatar = userInfo.avatar
          }
          else {
            userInfo.gender===0?this.avatar=this.base64Json['man_avatar_default']:this.avatar=this.base64Json['woman_avatar_default']
          }
        }
        else {
          if (userInfo.avatar !==null){
            this.avatar = userInfo.avatar
          }
          else {
            userInfo.gender===0?this.avatar=this.base64Json['customer_avatar_man']:this.avatar=this.base64Json['customer_avatar_default']
          }
        }
      }
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
        //res.data['customer_info']?this.receiver=res.data['customer_info'].account:null
      }).catch(err=>{
        console.log(err)
      })
    },
    //发送消息
    sendMessage(message) {
      let sendTime = new Date().getTime()
      try {
        this.socket.emit('sendMsg',message,this.sender,this.receiver,sendTime,this.avatar);

      }
      catch (err) {
        console.log(err)
      }
      finally {
        this.messageList.push({
          message,
          'sender':this.sender,
          'sendTime':sendTime,
          'avatar':this.avatar
        })

        this.scrollToBottom()
        console.log('message send success')
      }
    },
    //接收消息
    receiveMsg() {
      try {
        this.socket.on('receiveMessage',(message,sender,senderTime,avatar) => {
          console.log(message,sender,senderTime,avatar,130)
          // this.sender = sender
          this.messageList.push({
            message,
            sender,
            avatar,
            senderTime
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
  watch:{
    $route(to,from){
      if (to.path !== from.path){
        this.initData()
      }
    }
  },
  created() {
    this.getCustomerInfo()
    this.initData()

    this.socket = io(this.url)
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
  background-color: #fff;
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
  position: relative;
  top:44px;
  height: calc(100vh - 44px - 4rem);
}
.content {
  width: 100vw;
  height: 100%;
  overflow: hidden;
}
.content-box{
  margin-top: .5rem;
  width: 100%;
  background-color: #8a8686;
}
/*.content-box{*/
/*  position: relative;*/
/*}*/
/*.content-box img{*/
/*  width: 10vw;*/
/*  height: 10vw;*/
/*}*/
/*.message {*/
/*  display: inline-block;*/
/*  max-width: 80%;*/
/*  margin-top: .5rem;*/
/*  margin-bottom: .5rem;*/
/*  padding: .5rem 0;*/
/*}*/
/*.message span {*/
/*  display: inline-block;*/
/*  padding: 1rem;*/
/*  max-width: 80%;*/
/*  border-radius: .4rem;*/
/*  word-break: break-all;*/
/*  text-align: left;*/
/*}*/
/*.content-sender{*/
/*  text-align: right;*/
/*  margin-right: 2vw;*/
/*}*/
/*.message-sender span{*/
/*  background-color: red;*/
/*}*/
/*.message-receiver {*/
/*  position: relative;*/
/*  margin-left: 10%;*/
/*}*/
/*.message-sender::after,*/
/*.message-receiver::before{*/
/*  position: relative;*/
/*  top:0;*/
/*  display: inline-block;*/
/*  content: '';*/
/*  border-width: .8rem;*/
/*  border-style: solid;*/
/*}*/
/*.message-sender::after {*/
/*  border-color: transparent transparent transparent red;*/
/*}*/
/*.content-receiver{*/
/*  position: relative;*/
/*  text-align: left;*/
/*}*/
/*.content-receiver img {*/
/*  position: absolute;*/
/*  left: 2vw;*/
/*  top:.5rem;*/
/*  !*transform: translateY(-50%);*!*/
/*}*/
/*.message-receiver span {*/
/*  background-color: #1e8efc;*/
/*}*/
/*.message-receiver::before{*/
/*  border-color: transparent #1e8efc transparent transparent;*/
/*}*/
.bottom {
  position: fixed;
  bottom: 0;
}
</style>
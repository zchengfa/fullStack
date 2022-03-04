<template>
  <div class="customer">
    <nav-bar class="nav">
      <div slot="left" @click="back"><img src="~assets/image/detail/back.svg" alt="backImage"></div>
      <div v-if="$store.state.userInfo.identity!==1000" slot="center">客服</div>
      <div v-else slot="center">{{$route.params.receiver}}</div>
    </nav-bar>
    <div class="message-box">
      <Scroll class="content" ref="message" :padding="true">
        <div class="content-box-total"  v-for="(item,index) in messageList" :key="index">
          <span class="message-time" v-if="item.isShowTime">{{item.showTime}}</span>
          <div class="content-box" :class="{'content-sender':item.sender===sender,'content-receiver':item.sender!==sender}">
            <div class="message" :class="{'message-sender':item.sender===sender,'message-receiver':item.sender!==sender}">
              <span>{{item.message}}</span>
            </div>
            <img v-if="item.sender===user" :class="{'sender-image':item.sender===sender}" :src="item.avatar"  alt="sender_image">
            <img v-else :class="{'rec-image':item.sender!==sender}" :src="item.avatar"  alt="rec_image">
          </div>
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

import io from 'socket.io-client'
import {formatTime} from "@/common/utils";
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
      userInfo:this.$store.state.userInfo,
      allMsgHistory:[]
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

      //获取localstorage中存储的消息记录
      this.userInfo.identity!==1000?this.allMsgHistory=JSON.parse(localStorage.getItem(this.receiver+'history')):this.allMsgHistory=JSON.parse(localStorage.getItem(this.sender+'history'))
      this.allMsgHistory?this.allMsgHistory.map(item=>{
        if (this.userInfo.identity!==1000){
          if (item.sender===this.sender){
            this.messageList = item.messageList
          }
        }
        else {
          if (item.sender===this.receiver){
            this.messageList = item.messageList
          }
        }

      }):null

      this.dealTheShowTime()
    },
    scrollToBottom(){
      //dom更新后重新获取滚动区域并滚动到最底部
      this.$nextTick(()=>{
        const scrollHeight = this.$refs.message.scroll.content.clientHeight
        const clientHeight = this.$refs.message.$el.clientHeight

        if (clientHeight<=scrollHeight){
          this.$refs.message.scroll.refresh()
          this.$refs.message.scroll.scrollTo(0,- (scrollHeight + 600),300)
          //自动上滑后刷新scroll组件
          this.$refs.message.scroll.refresh()
        }
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
        this.pushMessageAndSave(this.messageList,message,this.sender,sendTime,this.avatar)
        this.scrollToBottom()
        this.saveMsgHisToLocal()

        this.allMsgHistory.map(item=>{
          if (item.sender===this.receiver){
            item.messageList = this.messageList
            this.saveMsgHisToLocal()
          }
        })

        //获取最新一条消息，将最新一条消息和发送时间赋给联系人列表，以达到显示最新消息效果
        let up_to_dateMsg = this.messageList.slice(this.messageList.length-1,this.messageList.length)[0].message
        let up_to_sendTime = this.messageList.slice(this.messageList.length-1,this.messageList.length)[0].sendTime
        let msgLocal = JSON.parse(localStorage.getItem(this.sender))
        msgLocal?msgLocal.map(item=>{
          if (item.sender===this.receiver){
            item.message = up_to_dateMsg
            item.sendTime = up_to_sendTime
            localStorage.setItem(this.sender,JSON.stringify(msgLocal))
          }
        }):null
      }
    },
    //接收消息
    receiveMsg() {
      try {
        this.socket.on('receiveMessage',(message,sender,sendTime,avatar) => {
          let msgHisLocal = JSON.parse(localStorage.getItem(this.sender+'history'))
          if (sender!==this.receiver){
            //处理本地存储中历史消息数据
            //let msgHisLocal = JSON.parse(localStorage.getItem(this.sender+'history'))
            let allHisCount=0
            msgHisLocal.map(his=>{
              if (his.sender===sender){
                this.pushMessageAndSave(his.messageList,message,sender,sendTime,avatar)
                localStorage.setItem(this.sender+'history',JSON.stringify(msgHisLocal))
                this.allMsgHistory = msgHisLocal
              }
              else {
                allHisCount++
              }

              if (allHisCount===msgHisLocal.length){
                msgHisLocal.push({
                  sender,
                  'receiver':this.sender,
                  messageList:[{
                    message,sender,sendTime,avatar
                  }]
                })
                localStorage.setItem(this.sender+'history',JSON.stringify(msgHisLocal))

              }
              this.allMsgHistory = msgHisLocal
            })
          }
          else{
            this.pushMessageAndSave(this.messageList,message,sender,sendTime,avatar)
            this.scrollToBottom()
            this.saveMsgHisToLocal()
            this.allMsgHistory = msgHisLocal
          }

          //处理本地中消息人列表数据
          if (this.userInfo.identity===1000){
            let msgLocal = JSON.parse(localStorage.getItem(this.sender))
            let allCount=0
            msgLocal.map(item=>{
              if (item.sender===sender){
                item.message=message
                item.sendTime=sendTime
                localStorage.setItem(this.sender,JSON.stringify(msgLocal))
              }
              else {
                allCount++
              }
              //msgLocal中没有该发送者的数据，重新设定数据并加入到msgLocal中
              allCount===msgLocal.length?(
                  function (this_sender){
                    let msgObj = {
                      message,sender,sendTime,avatar
                    }
                    msgLocal.push(msgObj)
                    localStorage.setItem(this_sender,JSON.stringify(msgLocal))
                  }
              )(this.sender):null
            })
          }
        })

      }
      catch (err) {
        console.log(err)
      }
    },
    //处理消息出接收时需要显示的时间戳
    dealTheShowTime() {
      let now_year = new Date().getFullYear()
      let now_month = new Date().getMonth()
      let now_day = new Date().getDate()
      this.messageList.map(item=>{
        if (item.isShowTime){
          //获取最新消息是在哪一月哪一天
          let time_year = new Date(item.sendTime).getFullYear()
          let time_month = new Date(item.sendTime).getMonth()
          let time_day = new Date(item.sendTime).getDate()

          let time = formatTime( 'mm-dd hh:mm',new Date(item.sendTime)).toString().substr(6,5)
          //如果是在同一年同一个月份，则判断消息距离现在过了几天
          if (now_year===time_year && time_month===now_month){

            //当天的消息显示几点几分
            if (time_day===now_day){
              item.showTime = time
            }

            //过了一天显示昨天 几点几分
            else if(now_day - time_day === 1){
              item.showTime = '昨天'+ time
            }

            //过了两天显示前天 几点几分
            else if(now_day - time_day === 2){
              item.showTime = '前天' + time
            }

            //大于等于三天小于等于七天显示星期几 几时几分
            else if(now_day - time_day >= 3 && now_day - time_day <= 7){
              let week = new Date(item.sendTime).getDay()
              switch (week) {
                case 0:
                  item.showTime = '星期天' + time;
                  break;
                case 1:
                  item.showTime = '星期一' + time;
                  break;
                case 2:
                  item.showTime = '星期二' + time;
                  break;
                case 3:
                  item.showTime = '星期三' + time;
                  break;
                case 4:
                  item.showTime = '星期四' + time;
                  break;
                case 5:
                  item.showTime = '星期五' + time;
                  break;
                case 6:
                  item.showTime = '星期六' + time;
                  break;
              }
            }
            else{
              item.showTime = formatTime('YY-MM-DD',new Date(item.sendTime)) + time
            }
          }

          //不属于同一年同一个月份显示年月日时分
          else{
            item.showTime = formatTime('YY-MM-DD',new Date(item.sendTime)) + time
          }
        }
      })
    },
    //将接收到的消息push到数组中
    pushMessageAndSave(arr,message,sender,sendTime,avatar,key_name){
      let obj = {
        'message':message,
        'sender':sender,
        'sendTime':sendTime,
        'avatar':avatar,
      }
      if(arr.length){
        //获取消息中最新一条消息，查看该条消息时间与即将发送的消息时间间隔有没有超过五分钟
        let lastMessage = arr.slice(arr.length-1,arr.length)
        lastMessage.map(item=>{

          //若即将发送的消息时间与数组中最后一条消息时间间隔大于等于五分钟
          if ((sendTime-item.sendTime)>= 5*60*1000){
            addShowTime()
          }
          //没有超过五分钟直接加入到数组中，不需要显示时间戳
          else{
            arr.push(obj)
          }
        })
      }
      else{
        addShowTime()
      }
      (arr&&key_name)?this.saveMsgToLocalstorage(arr,key_name):null

      function addShowTime(){
        obj.isShowTime = true
        obj.showTime = formatTime( 'mm-dd hh:mm',new Date(sendTime)).toString().substr(6,5)
        arr.push(obj)
      }
      console.log(arr)
    },
    //将接受到的消息存储到localstorage中
    saveMsgToLocalstorage(arr,key_name){
      let msgArr = []
      arr.map(item=>{
        msgArr.push({
          ...item
        })
      })
      localStorage.setItem(key_name,JSON.stringify(msgArr))
    },
    saveMsgHisToLocal(){
      if (this.allMsgHistory){
        this.userInfo.identity!==1000?localStorage.setItem(this.receiver+'history',JSON.stringify(this.allMsgHistory)):localStorage.setItem(this.sender+'history',JSON.stringify(this.allMsgHistory))
      }
      else{
        this.allMsgHistory = []
        let msgObj = {}

        if (this.userInfo.identity!==1000){
         msgObj = {
           sender:this.sender,
           receiver:this.receiver,
           messageList:this.messageList
         }
         this.allMsgHistory.push(msgObj)
          localStorage.setItem(this.receiver+'history',JSON.stringify(this.allMsgHistory))
        }
        else {
          msgObj = {
            sender:this.sender,
            receiver:this.receiver,
            messageList:this.messageList
          }
          this.allMsgHistory.push(msgObj)
          localStorage.setItem(this.sender+'history',JSON.stringify(this.allMsgHistory))
        }
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
    this.initData()
    this.socket = io(this.url)
  },
  mounted() {
    //通知服务器用户上线了
    this.socket.emit('online',this.user)
    this.receiveMsg()
    this.scrollToBottom()
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
  position: relative;
  display: flex;
  justify-items: center;
  align-items: center;
  margin-top: .5rem;
  max-width: 80%;
}
.content-sender{
  left: 18%;
}
.content-receiver{
  left: 2%;
  flex-direction: row-reverse;
}
.message{
  display: flex;
  align-items: center;
  justify-items: center;
  flex: 9;
  overflow: hidden;
}
.message-time{
  display: inline-block;
  padding: .2rem .5rem;
  margin-left: 50%;
  margin-top: .5rem;
  min-width: 2rem;
  text-align: center;
  transform: translateX(-50%);
  background-color: #dcd3d3;
  border-radius: .2rem;
  color: #918585;
  font-size: .8rem;
  letter-spacing: .1rem;
}
.message span{
  padding: 1rem;
  max-width: 80%;
  border-radius: .3rem;
  word-break: break-all;
  overflow-x: hidden;
}
.content-box img{
  flex: 1;
  width: 2.5rem;
  border-radius: 50%;
}
.message-receiver span{
  background-color: #1e8efc;
}
.message-sender span{
  background-color: #fd001e;
}
.message-sender{
  flex-direction: row-reverse;
}
.message-receiver::before,
.message-sender::before{
  position: relative;
  top:50%;
  display: block;
  content: '';
  border-width: .5rem;
  border-style: solid;
}
.message-sender::before{
  border-color: transparent transparent transparent #fd001e;
}
.message-receiver::before{
  border-color: transparent #1e8efc transparent transparent;
}
.bottom {
  position: fixed;
  bottom: 0;
}
</style>
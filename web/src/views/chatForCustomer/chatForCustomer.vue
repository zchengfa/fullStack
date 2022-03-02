<template>
<div class="chat-for-customer">
  <div class="customer-info">
    <img v-if="customerInfo.avatar" class="avatar" :src="customerInfo.avatar" alt="avatar">
    <img v-else class="avatar" src="~assets/image/profile/header.png" alt="avatar_default">
    <span v-if="!customerInfo.username" class="account">{{customer}}</span>
    <span v-else class="customer-name">{{customerInfo.username}}</span>
  </div>
  <div class="sender-info-list">
    <ul>
      <li v-for="(item,index) in messageArr" :key="index" >
        <div class="info-box" @click="toSendMessage(item.sender)">
          <div class="avatar-box">
            <img v-show="item.avatar" class="avatar" :src="item.avatar" alt="avatar">
            <img v-show="!item.avatar" class="avatar" src="~assets/image/profile/header.png" alt="avatar">
          </div>
          <div class="message-box">
            <p class="sender-name">{{item.sender}}</p>
            <p class="message">{{item.message}}</p>
          </div>
          <div class="message-time"><span v-if="!item.showTime">{{item.sendTime}}</span><span v-else>{{item.showTime}}</span></div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import io from 'socket.io-client'
import {formatTime} from "@/common/utils";

export default {
  name: "chatForCustomer",
  data(){
    return {
      socket:null,
      customer:null,
      messageArr:[],
      customerInfo:null,
      sender:null,
      allMsgHistory:[]
    }
  },
  methods:{
    //点击对应客户项，进入到跟客户聊天界面
    toSendMessage(sender){
      this.$router.push('/customer'+'/'+sender)
    },
    //接收消息
    receiveMsg(){
      this.socket.on('receiveMessage',(message,sender,sendTime,avatar)=>{
        //处理所有发送者发送给客服的所有消息
        if (this.allMsgHistory.length){
          let allCount = 0
          this.allMsgHistory.map(item=>{
            if (item.sender===sender&&item.receiver===this.customer){
              this.pushMessageAndSave(item.messageList,message,sender,sendTime,avatar)
            }
            else{
              allCount++
            }
            if (allCount===this.allMsgHistory.length){
              this.pushHistory(this.allMsgHistory,message,sender,sendTime,avatar,this.customer)
            }
          })
        }else {
          this.pushHistory(this.allMsgHistory,message,sender,sendTime,avatar,this.customer)
        }
        this.saveMsgToLocalstorage(this.allMsgHistory,this.customer+'history')

        //处理所有发送者发送给客服的最新消息
        if (this.messageArr.length){
          let allCount = 0
          this.messageArr.map(item=>{
            //查看消息列表中是否有该用户的数据，若有则说明之前发送过消息给客服，只需将用户发送的消息以及发送时间进行更新即可
            if (item.sender===sender){
              item.message = message
              item.sendTime = sendTime
              this.saveMsgToLocalstorage(this.messageArr,this.customer)
            }
            else {
              allCount++
            }
            //当allCount的数量等于消息列表的数据时，说明该用户没有发送过消息给客服，可以将该用户的消息加入到列表中
            if (allCount===this.messageArr.length){
              this.pushMessageAndSave(this.messageArr,message,sender,sendTime,avatar,this.customer)
            }
          })
        }
        //列表项中没有任何数据，直接将客户发送的信息push到列表项中
        else{
          this.pushMessageAndSave(this.messageArr,message,sender,sendTime,avatar,this.customer)
        }

        this.dealTheShowTime()
      })
    },
    //将接收到的消息push到数组中
    pushMessageAndSave(arr,message,sender,sendTime,avatar,key_name){
      arr.push({
        'message':message,
        'sender':sender,
        'sendTime':sendTime,
        'avatar':avatar
      });
      (arr&&key_name)?this.saveMsgToLocalstorage(arr,key_name):null
    },
    //将所有消息push到数组中
    pushHistory(arr,message,sender,sendTime,avatar,receiver){
      arr.push({
        sender,
        receiver,
        messageList: [
          {
            message,
            sender,
            sendTime,
            avatar
          }
        ]
      })
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
    //处理消息中的时间
    dealTheShowTime(){
      let now = new Date().getTime()
      this.messageArr.map(item=>{
        //获取当前消息时间与现在时间的毫秒差
        let time_difference = now-Number(item.sendTime)

        //毫秒差小于一天，直接让他显示几点几分
        if(time_difference<24*60*60*1000){
          item.showTime = formatTime( 'mm-dd hh:mm',new Date(item.sendTime)).toString().substr(6,5)
        }

        //大于等于一天且小于两天，显示昨天
        else if (time_difference>=24*60*60*1000&&time_difference<24*60*60*1000*2){
          item.showTime = '昨天'
        }

        //大于等于两天且小于三天，显示前天
        else if (time_difference>=24*60*60*1000*2&&time_difference<24*60*60*1000*3){
          item.showTime = '前天'
        }

        //大于等于三天且小于七天，显示星期几
        else if(time_difference>=24*60*60*1000*3&&time_difference<24*60*60*1000*7){
          let week = new Date(item.sendTime).getDay()
          switch (week) {
            case 0:
              item.showTime = '星期天';
              break;
            case 1:
              item.showTime = '星期一';
              break;
            case 2:
              item.showTime = '星期二';
              break;
            case 3:
              item.showTime = '星期三';
              break;
            case 4:
              item.showTime = '星期四';
              break;
            case 5:
              item.showTime = '星期五';
              break;
            case 6:
              item.showTime = '星期六';
              break;
          }
        }

        //超过七天，显示年月日
        else {
          item.showTime = formatTime('YY-MM-DD',new Date(item.sendTime))
        }
        localStorage.setItem(this.customer,JSON.stringify(this.messageArr))
      })
    }
  },
  created() {
    let userInfo = this.$store.state.userInfo
    userInfo.username?this.customer=userInfo.username:this.customer=userInfo.account
    this.customerInfo = userInfo
    this.socket = io(this.$link)

    //获取localstorage中对应的最新消息数据
    let msgLocal = JSON.parse(localStorage.getItem(this.customer))
    msgLocal?this.messageArr=msgLocal:null

    //获取localstorage中对应的历史消息数据
    let msgHistory = JSON.parse(localStorage.getItem(this.customer+'history'))
    msgHistory?this.allMsgHistory = JSON.parse(localStorage.getItem(this.customer+'history')):null
  },
  mounted() {
    this.socket.emit('online',this.customer)
    //执行接收消息方法，若有消息发送给当前客服
    this.receiveMsg()
    this.dealTheShowTime()
  },
}
</script>

<style scoped>
.chat-for-customer{
  width: 100vw;
  background-color: #d2367c;
}
.avatar{
  margin: .5rem;
  width: 32px;
  height: 32px;
}
.info-box{
  display: flex;
  justify-items: center;
  align-items: center;
  background-color: #fff;
}
.info-box .avatar-box{
  flex: 1;
}
.info-box .message-box{
  flex: 7;
}
.info-box .message-time{
  flex: 2;
  color: #8a8686;
  font-size: .8rem;
}
.info-box .message-box p{
  margin:0;
  /*width: 20rem;*/
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow: hidden;
}
.message-box p:first-child{
  margin-bottom: .2rem;
}
.message-box .message{
  color: #8d8686;
  font-size: .8rem;
}
.account,.customer-name{
  position: relative;
  top: -18px;
  display: inline-block;
  height: 32px;
  line-height: 32px;
}
</style>
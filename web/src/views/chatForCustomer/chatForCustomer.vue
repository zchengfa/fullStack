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
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: "chatForCustomer",
  data(){
    return {
      socket:null,
      customer:null,
      messageArr:[],
      customerInfo:null,
      sender:null
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
        // if (this.messageArr.length){
        //   this.messageArr.map(item=>{
        //     if (item.sender===sender){
        //       item.message = message
        //       item.senderTime = sendTime
        //     }
        //   })
        // }
        // else{
        //   this.pushMessage(this.messageArr,message,sender,sendTime,avatar)
        // }
        this.pushMessage(this.messageArr,message,sender,sendTime,avatar)
        this.messageArr.map(item=>{
          if (item.sender===sender){
            item.message=message
            item.sendTime=sendTime
          }
        })
      })
    },
    //获取发送者信息
    pushMessage(arr,message,sender,sendTime,avatar){
      arr.push({
        'message':message,
        'sender':sender,
        'sendTime':sendTime,
        'avatar':avatar
      })
    },
    //将接受到的消息存储到localstorage中
    saveMsgToLocalstorage(){
      let msgArr = []
      this.messageArr.map(item=>{
        msgArr.push({
          ...item
        })
      })
      localStorage.setItem(this.customer,JSON.stringify(msgArr))
    }
  },
  created() {
    let userInfo = this.$store.state.userInfo
    userInfo.username?this.customer=userInfo.username:this.customer=userInfo.account
    this.customerInfo = userInfo
    this.socket = io(this.$link)

    //获取localstorage中对应的消息数据
    let msgLocal = JSON.parse(localStorage.getItem(this.customer))
    msgLocal?this.messageArr=msgLocal:null
  },
  mounted() {
    this.socket.emit('online',this.customer)
    //执行接收消息方法，若有消息发送给当前客服
    this.receiveMsg()
  },
  // activated() {
  //   //获取localstorage中对应的消息数据
  //   let msgLocal = JSON.parse(localStorage.getItem(this.customer))
  //   msgLocal?this.messageArr=msgLocal:null
  // },
  // deactivated() {
  //   this.saveMsgToLocalstorage()
  // }
}
</script>

<style scoped>
.chat-for-customer{
  width: 100vw;
  background-color: #b7a1a1;
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
  flex: 9;
}
.info-box .message-box p{
  margin:0;
  width: 20rem;
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
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
      <li>
        <div class="info-box" v-for="(item,index) in messageArr" :key="index">
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
    //接收消息
    receiveMsg(){
      this.socket.on('receiveMessage',(message,sender,sendTime,avatar)=>{
        if (this.messageArr.length){
          if (this.sender===sender){
            this.messageArr.map(item=>{
              if (item.sender===sender){
                item.message=message
                item.sendTime = sendTime
              }
            })
          }
          else{
            this.pushMessage(this.messageArr,message,sender,sendTime,avatar)
            this.sender = sender
          }

        }
        else {
          this.pushMessage(this.messageArr,message,sender,sendTime,avatar)
          this.sender = sender
        }
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
      return arr
    }
  },
  created() {
    let userInfo = this.$store.state.userInfo
    this.customer = userInfo.account
    this.customerInfo = userInfo
    this.socket = io(this.$link)

  },
  mounted() {
    this.socket.emit('online',this.customer)
    //执行接收消息方法，若有消息发送给当前客服
    this.receiveMsg()
  }
}
</script>

<style scoped>
.avatar{
  margin: .5rem;
  width: 32px;
  height: 32px;
}
.info-box{
  display: flex;
  justify-items: center;
  align-items: center;
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
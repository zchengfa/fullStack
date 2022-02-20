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
        <div v-for="(item,index) in senderInfo" :key="index">
          <img v-show="item.avatar" class="avatar" :src="item.avatar" alt="avatar">
          <img v-show="!item.avatar" class="avatar" src="~assets/image/profile/header.png" alt="avatar">
          <span v-if="!item.username" class="account">{{item.account}}</span>
          <span v-show="item.username" class="sender-name">{{item.username}}</span>
          <span class="message">{{messageArr[index].message}}</span>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import io from 'socket.io-client'
import {getSenderInfo} from "@/network/customer";

export default {
  name: "chatForCustomer",
  data(){
    return {
      socket:null,
      customer:null,
      senderInfo:[],
      messageArr:[],
      customerInfo:null,
      sender:null,
      hadSender:false
    }
  },
  methods:{
    //接收消息
    receiveMsg(){
      this.socket.on('receiveMessage',(message,sender,sendTime)=>{
        this.messageArr.push({
          'message':message,
          'sender':sender,
          'sendTime':sendTime
        })
        this.getSenderInfo(sender)
      })
    },
    //获取发送者信息
    getSenderInfo(sender){
      getSenderInfo(sender).then(res=>{
        if (res.data){
          this.senderInfo.map(item=>{
            if (item.sender!==this.sender){
              this.senderInfo.push(res.data)
              this.sender = sender
            }
          })
          //this.senderInfo.push(res.data)
        }


      }).catch(err=>{
        console.log(err)
      })
    },
  },
  created() {
    let userInfo = this.$store.state.userInfo
    this.customer = userInfo.account
    this.customerInfo = userInfo
    this.socket = io(this.$link)

  },
  mounted() {
    this.socket.emit('online',this.customer)
    //执行接收消息方法，若有消息发送给当前客服，获取发送者信息
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
.account,.customer-name{
  position: relative;
  top: -18px;
  display: inline-block;
  height: 32px;
  line-height: 32px;
}
</style>
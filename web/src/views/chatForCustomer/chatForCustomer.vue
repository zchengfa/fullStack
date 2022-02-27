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
      sender:null,
      messageHistory:[],
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
        if (this.messageHistory.length){
          let allCount = 0
          this.messageHistory.map(item=>{
            if (item.sender===sender&&item.receiver===this.customer){
              this.pushMessageAndSave(item.messageList,message,sender,sendTime,avatar)
            }
            else{
              allCount++
            }
            if (allCount===this.messageHistory.length){
              this.pushHistory(message,sender,sendTime,avatar)
            }
          })
        }else {
          this.pushHistory(message,sender,sendTime,avatar)
        }
        this.saveMsgToLocalstorage(this.messageHistory,this.customer+'history')

        //处理所有发送者发送给客服的最新消息
        if (this.messageArr.length){
          let allCount = 0
          this.messageArr.map(item=>{
            //查看消息列表中是否有该用户的数据，若有则说明之前发送过消息给客服，只需将用户发送的消息以及发送时间进行更新即可
            if (item.sender===sender){
              item.message = message
              item.senderTime = sendTime
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
    pushHistory(message,sender,sendTime,avatar){
      this.messageHistory.push({
        sender,
        receiver: this.customer,
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
    msgHistory?this.messageHistory = JSON.parse(localStorage.getItem(this.customer+'history')):null
  },
  mounted() {
    this.socket.emit('online',this.customer)
    //执行接收消息方法，若有消息发送给当前客服
    this.receiveMsg()
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
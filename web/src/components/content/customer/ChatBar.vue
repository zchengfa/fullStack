<template>
<div class="chat-bar">
  <div class="chat-with-voice"><img src="~assets/image/customer/voice.png" alt="voice"></div>
  <div class="chat">
    <input type="text" v-model="message" @input="inputMessage" @keyup.enter="keyUp">
    <button class="emoji" @click="emoji"></button>
  </div>
  <div class="other">+</div>
  <div class="send" v-show="isSend" @click="sendMessage">发送</div>
</div>
</template>

<script>
export default {
  name: "ChatBar",
  data(){
    return {
      message:'',
      isSend:false
    }
  },
  methods:{
    emoji(){
      console.log('打开表情库')
    },
    inputMessage(){
      if (this.message.length >= 1) {
        this.isSend = true
      }
      else {
        this.isSend = false
      }
    },
    sendMessage() {
      this.$emit('sendMessage',this.message)
      this.message = ''
      this.isSend = false
    },
    keyUp(){
      this.$emit('keyUpEnter',this.message)
      this.message = ''
      this.isSend = false
    }
  }
}
</script>

<style scoped>
.chat-bar {
  display: flex;
  width: 100vw;
  height: 4rem;
  line-height: 4rem;
  background-color: #e0d9d9;
}
.chat-bar div {
  flex: 1;
  text-align: center;
}
.chat-bar .chat {
  flex: 4.5;
}
.chat-with-voice img{
  position: relative;
  top:.7rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #fff;
}
input{
  padding: 0;
  width: 100%;
  height: 60%;
  border-radius: 2rem;
  text-indent: 1rem;
}
button {
  position: absolute;
  top: 1rem;
  right: 16%;
  width: 2rem;
  height: 2rem;
  background-image: url("~assets/image/customer/emoji.png");
  z-index: 11;
}
.other{
  font-size: 2rem;
  color: #8d8686;
}
.send {
  position: absolute;
  top:.8rem;
  right: 1%;
  width: 3rem;
  height: 2.2rem;
  line-height: 2.2rem;
  background:linear-gradient(to right, #d4912d, #e0b007);
  border-radius: 8px;
  color: #fff;
}
</style>
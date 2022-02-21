<template>
<div class="chat-bar" >
  <div class="chat-controller">
    <div class="chat-with-voice"><img src="~assets/image/customer/voice.png" alt="voice"></div>
    <div class="chat">
      <input type="text" v-model="message" @input="inputMessage" @focus="onfocus" @keyup.enter="keyUp">
      <button class="emoji" @click="emoji"></button>
    </div>
    <div class="other" @click="otherController">+</div>
    <div class="send" v-show="isSend" @click="sendMessage">发送</div>
  </div>
  <div class="chat-other" v-show="showEmoji">
    <div class="content">
      <Emoji @selectEmoji="selectEmoji"></Emoji>
    </div>
  </div>
  <div class="chat-other" v-show="showOtherController">
    <div class="content">
      <chat-other class="other-controller"></chat-other>
    </div>
  </div>
</div>
</template>

<script>
import Emoji from "@/components/content/customer/Emoji";
import ChatOther from "@/components/content/customer/ChatOther";
export default {
  name: "ChatBar",
  data(){
    return {
      message:'',
      isSend:false,
      showEmoji:false,
      showOtherController:false
    }
  },
  components:{
    Emoji,
    ChatOther
  },
  methods:{
    onfocus(){
      //点击输入框时，隐藏表情组件和其他功能组件
      this.showEmoji = false
      this.showChatOther = false
    },
    emoji(){
      //点击输入框中表情按钮，控制表情组件的显示和隐藏
      this.showEmoji = !this.showEmoji

      //显示或隐藏表情的同时，隐藏其他组件
      this.showOtherController = false
    },
    otherController(){
      console.log('other')
      //点击加号，显示其他控件
      this.showOtherController = !this.showOtherController

      //显示或隐藏其他控件的同时，隐藏表情等组件
      this.showEmoji = false
    },
    inputMessage(){
      //检测输入框是否有内容，来控制发送按钮的显示与隐藏
      if (this.message.length >= 1) {
        this.isSend = true
      }
      else {
        this.isSend = false
      }
    },
    sendMessage() {
      //将发送消息事件以及发送的内容发送给父组件
      this.$emit('sendMessage',this.message)
      //点击发送按钮后清空输入框中的内容
      this.message = ''
      //点击发送按钮后隐藏发送按钮
      this.isSend = false
      this.showEmoji = false
    },
    keyUp(){
      //将enter键盘事件以及内容发送给父组件
      this.$emit('keyUpEnter',this.message)
      //enter键回弹后清空输入框内容
      this.message = ''
      //enter键回弹后隐藏发送按钮
      this.isSend = false
    },
    //选择表情
    selectEmoji(value) {
      //将表情加到输入框中
      this.message += value
      //执行函数，判断输入框是否有内容来控制发送按钮的显示隐藏
      this.inputMessage()
    }
  }
}
</script>

<style scoped>
.chat-bar {
  width: 100vw;
  background-color: #e0d9d9;
}
.chat-bar div.chat-controller{
  display: flex;
  line-height: 4rem;
}
.chat-bar div.chat-controller div {
  flex: 1;
  text-align: center;
}
.chat-bar div.chat-controller .chat {
  flex: 4;
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
  right: 18%;
  width: 2rem;
  height: 2rem;
  background-image: url("~assets/image/customer/emoji.png");
  background-repeat: no-repeat;
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
.chat-other .other-controller{
  height: 20vh;
}
</style>
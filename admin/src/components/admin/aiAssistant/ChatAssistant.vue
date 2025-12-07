<script setup lang="ts">
import { chatAssistantStore, userStore } from '@/pinia/pinia';
import ChatBubble from "@/components/common/ChatBubble.vue";
import {storeToRefs} from "pinia";
import {debounce, throttle, SOCKET_URL} from '@/common/utils'
import {ref, onMounted, onBeforeUnmount, nextTick, PropType,watch} from "vue";
import SocketService from "@/socket/socket";
import {Right, Avatar, Clock, Close, FullScreen, Plus, Setting, Download,Loading} from "@element-plus/icons-vue";
import ChatMessageList from "@/components/common/ChatMessageList.vue";
const assistantPinia = chatAssistantStore();
const userPinia = userStore();
const { isChatAssistant,mainMessageBody,isShowMask,isFinish } = storeToRefs(assistantPinia);
const { userInfo } = storeToRefs(userPinia);

const chatAssistantRef = ref(null)
const userQuestion = ref('')
const isChatBoxActive = ref(false)
const observer = ref<any>(null)
const inputRef = ref(null)
const activeQuestionList = ref(false)
const timer = ref<any>(null)
const timerFade = ref<any>(null)
const loadingTimer = ref<any>(null)
const isShowBottomEl = ref(false)
const isShowLoadMore = ref(false)
const loadingCustom = ref('加载中...')

const socket = new SocketService(SOCKET_URL,{
  auth:{
    token: sessionStorage.getItem("token"),
  }
});

const emits = defineEmits(['toolClickEvent','closeAssistantEvent'])

defineProps({
  iconData:{
    type: Array as PropType<{icon:string,message:string}[]>,
    default(){
      return [{icon:'icon',message:'icon标题'}]
    }
  },
  maskQuestionList:{
    type: Array,
    default(){
      return ['AI助理能为我做什么？','如何调用或者部署DeepSeek？','我有哪些云资源？']
    }
  },
  showAside:{
    type: Boolean,
    default(){
      return false
    }
  }
})

//顶部工具栏点击事件
const toolClickEvent = (eventName:string)=>{
  emits('toolClickEvent',{
    eventName,
    ownerElement:chatAssistantRef.value
  })
}

//关闭AI聊天组件
const closeChatAssistant = (e:any,icon:string)=>{
  e.stopPropagation();
  emits('closeAssistantEvent',icon)
  timer.value = setTimeout(()=>{
    assistantPinia.changeMaskStatus(false)
  },300)
  timer.value = setTimeout(()=>{
    activeQuestionList.value = false
  },600)
  assistantPinia.changeChatAssistant(false);
}

//聊天输入框的聚焦与失焦
const chatFocusOrBlur = (status:boolean)=>{
  isChatBoxActive.value = status;
}

const askQuestionForList = (question:string)=>{
  userQuestion.value = question;
  sendQuestion()
}

//键盘按下enter时发送问题
const sendMessage = (event:any)=>{
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // 阻止默认换行
    sendQuestion()    // 调用发送方法
    chatFocusOrBlur(false) //失焦
  }
}

const sendQuestion = ()=> {
  if(isShowMask.value && userQuestion.value.length) assistantPinia.changeMaskStatus(false)
  if(!userQuestion.value.length) return
  //将问题发送给后端
  socket.emit('askAI',userQuestion.value)
  //将用户发送的问题交给pinia进行管理
  assistantPinia.alterMainMessageBody({
    time: new Date().getTime(),
    role: 'user',
    message: userQuestion.value,
  })
  //清空用户的问题
  const target = document.querySelector('.assistant-input-box') as HTMLElement;
  target && (target.textContent = '');
  userQuestion.value = ''

  //触发等待回答状态
  assistantPinia.changeAnswerStatus(true)
}

//节流监听
const throttleCallback = throttle((mutations:MutationRecord[]) => {
  mutations.forEach((mutation:MutationRecord) => {
    if(mutation.type === 'characterData'){
      userQuestion.value = mutation.target.data.trim();
    }
  })
},50)

//监听并添加防抖处理消息列表滚动事件
const messageListScroll = debounce(async (e: any) => {
  // 判断是否到了底部（考虑1px的误差）
  const isAtBottom = e.scrollHeight - e.scrollTop - e.clientHeight <= 1;

  // 更新底部按钮显示状态
  isShowBottomEl.value = !isAtBottom;

  // 判断是否滚动到了顶部（考虑1px的误差）
  if (e.scrollTop <= 1) {
    isShowLoadMore.value = true
    // 加载历史消息
    const result = await assistantPinia.loadHistoryMessage()

    loadingCustom.value = result.message
    //隐藏加载组件
    loadingTimer.value = setTimeout(()=>{
      isShowLoadMore.value = false
      loadingCustom.value = '加载中...'
    },500)

  }
},100)

watch(()=> isShowMask ,(n,o)=>{
  timerFade.value = setTimeout(()=>{
    activeQuestionList.value = o
  },100)
} , {deep:true})

onMounted(()=>{
  //初始化消息列表
  assistantPinia.initMessageBody()
  //连接
  socket.connect()

  //监听AI的回答
  socket.on('AIResults',(result:any)=>{
    const {isFinishAnswer,content,time} = result

    assistantPinia.alterMainMessageBody({
      time,
      role: 'assistant',
      message: content,
      isFinishAnswer
    })

    //关闭等待回答状态
    isFinish ? assistantPinia.changeAnswerStatus(false) : null
  })

  nextTick(()=>{
    if(!inputRef.value) return
    observer.value = new MutationObserver(throttleCallback)

    observer.value.observe(inputRef.value, {
      characterData: true, //监听文本内容变化
      subtree: true //监听所有后代
    })
  })
})

onBeforeUnmount(()=>{
  clearTimeout(timer.value);
  clearTimeout(timerFade.value)
  clearTimeout(loadingTimer.value)
  observer.value?.disconnect();
})

</script>

<template>
<div ref="chatAssistantRef" id="chat-assistant" :class="isChatAssistant ? 'chat-assistant-s assistant-float' : 'chat-assistant-h assistant-float'">
  <div class="assistant-side" v-if="showAside">
    <h3 class="side-title">MM AI助理</h3>
    <div class="new-session-box">
      <el-button type="primary" disabled icon="el-icon-plus">新建会话</el-button>
    </div>
  </div>
  <div class="assistant-container">
    <div class="assistant-top assistant-item">
      <div class="assistant-title"><span v-if="!showAside">MM AI助理</span></div>
      <div class="icon-boxes">
        <slot name="icon-box">
          <div class="icon-box" v-for="(item,index) in iconData" :key="index" @click="toolClickEvent(item.icon)">
            <el-icon class="chat-tool-icon" v-if="item.icon === 'plus'"><Plus></Plus></el-icon>
            <el-icon class="chat-tool-icon" v-else-if="item.icon === 'setting'"><Setting></Setting></el-icon>
            <el-icon class="chat-tool-icon" v-else-if="item.icon === 'fullscreen'"><FullScreen></FullScreen></el-icon>
            <el-icon class="chat-tool-icon" v-else-if="item.icon === 'history'"><Clock></Clock></el-icon>
            <el-icon class="chat-tool-icon" v-else-if="item.icon === 'window'">
              <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M896 128a64 64 0 0 1 64 64v640a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V192a64 64 0 0 1 64-64h768zM576 211.136L147.2 211.2v601.6H576V211.136z m300.8 0.064l-217.6-0.064V812.8h217.6V211.2z"></path></svg>
            </el-icon>
            <chat-bubble message-color="#fff" message-size=".8rem" :bubble-message="item.message" arrow-direction="top" bubble-background-color="#000"></chat-bubble>
          </div>
          <div class="icon-box" @click="(e:any)=> closeChatAssistant(e)">
            <el-icon class="chat-tool-icon"><Close></Close></el-icon>
          </div>
        </slot>
      </div>
    </div>
    <div class="assistant-content assistant-item" >
      <chat-message-list ref="messageListRef"
                         :is-show-load-more="isShowLoadMore"
                         :is-show-bottom-el="isShowBottomEl"
                         left-role="assistant"
                         :message-data="mainMessageBody"
                         @scroll-event="messageListScroll">
        <template #user-avatar>
          <img style="width: 32px; height: 32px" v-if="userInfo.avatar" :src="userInfo.avatar" alt="user_avatar"/>
          <el-icon style="font-size: 32px;" v-else>
            <Avatar></Avatar>
          </el-icon>
        </template>
        <template #bottom>
          <el-icon>
            <download></download>
          </el-icon>
        </template>
        <template #loading>
          <div class="loading-custom">
            <el-icon :class="isShowLoadMore ? 'loading-custom-icon':''"><Loading></Loading></el-icon>
            <span class="loading-custom-tip">{{loadingCustom}}</span>
          </div>
        </template>
      </chat-message-list>
      <div class="chat-assistant-mask" v-show="false">
        <div class="mask-top">
          <div class="ai-img-box">
            <img class="ai-img" src="../../../assets/image/admin/ai.png" alt="ai_assistant_img"/>
          </div>
          <h2 class="title">你好，我是</h2>
          <h2 class="title title-assistant">MM AI助理</h2>
        </div>
        <div class="mask-content">
          <div class="question-item-box" @click="askQuestionForList(item)" :class="activeQuestionList ? 'question-item-box-active' : 'question-item-box-hidden'" v-for="(item,index) in maskQuestionList" :key="index">
            <span class="mask-question">{{item}}</span>
            <el-icon><Right></Right></el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="assistant-bottom assistant-item">
      <div class="assistant-chat-box" :class="isChatBoxActive ? 'chat-box-active' : 'chat-box-normal'">
        <div class="assistant-input-box" @keydown="(e:any)=>sendMessage(e)" ref="inputRef" enterkeyhint="send" @focus="chatFocusOrBlur(true)" @blur="chatFocusOrBlur(false)" contenteditable="true" placeholder="请输入您遇到的问题，AI助理将为您解答"></div>
        <div class="chat-send">
          <div class="send-btn-box" @click="sendQuestion" :style="{cursor: userQuestion.length ? 'pointer' : 'not-allowed'}">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M876.202667 127.872L70.613333 352.426667l193.6 198.272 179.498667 3.114666 206.570667-201.386666c-5.461333-11.2-8.192-20.565333-8.192-28.117334 0-16.938667 6.634667-30.336 16.981333-39.850666 17.706667-16.277333 38.976-18.709333 63.872-7.296l153.237333-149.269334zM898.176 143.530667L673.664 949.12l-198.272-193.6L472.256 576l200-203.050667a54.229333 54.229333 0 0 0 35.498667 10.56c19.242667-1.066667 31.68-12.714667 37.525333-19.562666a50.133333 50.133333 0 0 0 12.096-35.178667 54.72 54.72 0 0 0-11.093333-31.232l151.893333-154.005333z" fill="#ffffff"></path></svg>
            <chat-bubble message-size=".8rem" bubble-message="发送消息" bubble-background-color="#000" message-color="#fff" arrow-direction="bottom"></chat-bubble>
          </div>
        </div>
      </div>
      <div class="AI-tip">内容由 AI 生成，仅供参考，您据此所作判断及操作均由您自行承担责任。</div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
:deep(.multi-color-bg::before){
  animation: rotateIcon 1s infinite linear;
}
#chat-assistant {
  position: absolute;
  display: flex;
  min-width: 21rem;
  background-color: var(--bg-color);
  transition: all ease-in-out .3s;
  box-shadow: 0 0 10px #6f6fca;
  overflow: hidden;
  z-index: 10;
  &.screen-normal{
    width: 30vw;
    height: 85vh;
    bottom: 0;
    border-radius: .5rem;
  }
  &.screen-full{
    left: -1rem;
    bottom: -1rem;
    width: 100vw;
    height: calc(100vh - 3rem);
    .assistant-content{
      max-width: 50vw;
    }
    .assistant-bottom{
      width: 50vw;
    }
  }
  &.assistant-snapping{
    width: 30vw;
    height: calc(100vh - 3rem);
    left: -1rem;
    bottom: -1rem;
  }
  &.assistant-float{
    width: 30vw;
    height: 85vh;
    bottom: 0;
    border-radius: .5rem;
  }
  .assistant-side{
    position: relative;
    width: 25vw;
    background-color: #e1e4ea;
    text-align: left;
    color: var(--primary-color);
    .side-title{
      text-indent: 1rem;
    }
    .new-session-box{
      position: absolute;
      bottom: 2rem;
      width: 100%;
      text-align: center;
      .el-button{
        width: 80%;
      }
    }
  }
  .assistant-container{
    display: flex;
    flex-direction: column;
    flex: 1;
    &::before{
      display: block;
      content: '';
      height: .4rem;
      background: linear-gradient(to right ,#5e5ee2,#e2624d);
    }
  }
  .assistant-content{
    position: relative;
    flex: 1;
    margin: 0 auto;
    width: 100%;
    overflow: scroll;
    scroll-behavior: smooth;
    .loading-custom{
      display: flex;
      align-items: center;
      justify-content: center;
      .loading-custom-tip{
        position: relative;
        margin-top: -2px;
        margin-left: .2rem;
      }
      .loading-custom-icon{
        animation: rotateIcon 3s infinite linear;
      }
    }
    /*遮罩层*/
    .chat-assistant-mask{
      box-sizing: border-box;
      padding: 1rem;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: var(--bg-color);
      .mask-top{
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .ai-img-box{
          margin-bottom: 1rem;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(#5e5ee2,#e2624d);
          .ai-img{
            width: 3rem;
            height: 3rem;
          }
        }
        h2.title{
          margin: 0;
        }
        h2.title-assistant{
          letter-spacing: 2px;
          background: linear-gradient(45deg, rgba(255, 0, 169, 1),  rgba(0, 255, 127, 1) 66.67%, rgba(0, 136, 255, 1) 100%);
          background-clip: text;
          color: transparent;
        }
      }
      .mask-content{
        padding: 1rem;
        @for $i from 1 through 3 {
          .question-item-box-active:nth-child(#{$i}){
            transition-delay: $i * .3s;
          }
        }
        .question-item-box-hidden{
          opacity: 0;
          transform: translateY(50px);
        }
        .question-item-box-active{
          opacity: 1;
          transform: translateY(0);
        }
        .question-item-box{
          margin: 1rem auto 0;
          width: 70%;
          padding: .8rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: .3rem;
          font-size: .9rem;
          border: 1px solid #d6d6d8;
          cursor: pointer;
          transition: opacity .5s ease-in-out , transform .5s ease-in-out;
          &:hover{
            color: #278bef;
            border-color: #278bef;
            background-color: #c6dcf3;
          }
          .mask-question{
            min-width: 10rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            text-align: left;
            overflow: hidden;
          }
        }
      }
    }
  }
  .assistant-top{
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    .assistant-title{
      background: linear-gradient(45deg, rgba(255, 0, 169, 1), rgba(255, 251, 0, 1) 33.33%, rgba(0, 255, 127, 1) 66.67%, rgba(0, 136, 255, 1) 100%);
      background-clip: text;
      color: transparent;
      background-size: 300%;
      animation: move 10s ease-in-out infinite;
    }
    .icon-boxes{
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .icon-box{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: .3rem;
        padding: .3rem .4rem;
        border-radius: .2rem;
        cursor: pointer;
        .chat-tool-icon{
          font-size: 1.1rem;
        }
      }
      .icon-box:hover{
        background-color: #c6c6ed;
      }
      .icon-box:hover .chat-bubble{
        display: flex;
      }
    }
  }
  .assistant-bottom {
    margin:  0 auto;
    width: 90%;
    .assistant-chat-box{
      padding: 2px;
      width: 100%;
      border-radius: .3rem;
      &.chat-box-normal{
        background: #d3cfcf;
      }
      &.chat-box-active{
        background: linear-gradient(45deg ,#5e5ee2,#e2624d, #90ec97);
        background-size: 300%;
        animation: move 10s ease-in-out infinite;
      }
      .assistant-input-box ,.chat-send{
        padding: .3rem;
        border-radius: .3rem;
        background-color: #fff;
      }
      .assistant-input-box{
        max-height: 4rem;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        text-align: left;
        overflow-y: scroll;
        color: var(--primary-color);
        &:focus{
          outline: none;
        }
        &:focus::before{
          content: none;
        }
        &:empty::before{
          content: attr(placeholder);
          color: #a3a1a1;
          user-select: none;
          text-align: justify;
          line-height: 1rem;
          font-size: .9rem;
        }
      }
      .chat-send{
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        .send-btn-box{
          position: relative;
          left: 92%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: .2rem;
          padding: .2rem;
          width: max-content;
          height: max-content;
          background-color: #6f6fca;
          cursor: pointer;
          &:hover .chat-bubble{
            display: flex;
          }
        }
      }
    }
  }
}
.chat-assistant-s{
  left: 120%;
}
.chat-assistant-h{
  left: -100vw;
}
.AI-tip{
  padding: 1rem 0;
  color: #c5c2c2;
  font-size: 10px;
}

@keyframes move {
  0%{
    background-position: 300% 0;
  }
  100%{
    background-position: -300% 0;
  }
}
@keyframes rotateIcon {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>

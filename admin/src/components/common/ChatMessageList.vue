<script setup lang="ts">
import ChatBubble from "@/components/common/ChatBubble.vue";
import {nextTick, onMounted, PropType, ref, watch} from "vue";
import {chatAssistantStore} from "@/pinia/pinia";
import {storeToRefs} from "pinia";

const chatContainerRef = ref(null)
const assistantPinia = chatAssistantStore()
const {isFinish} = storeToRefs(assistantPinia)

const props = defineProps({
  messageData:{
    type: Array,
    default(){
      return [
        {
          role:'user',
          message:'AI，你好！'
        },
        {
          role:'assistant',
          message: '您好，我是AI助理，有什么需要我为您做的呢？'
        }
      ]
    }
  },
  leftRole:{
    type: String as PropType<'user' | 'assistant'>,
    default(){
      return 'user'
    }
  },
  avatarShape:{
    type: String as PropType<'circle' | 'square'>,
    default(){
      return 'circle'
    }
  },
  isShowWaiting:{
    type: Boolean as PropType< true | false >,
    default(){
      return true
    }
  }
})

const scrollToBottom = ()=>{
  nextTick(()=>{
    if(chatContainerRef.value){
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  })
}

//监听消息列表，有新消息时自动滚动到最底部
watch(()=> props.messageData,(n,o)=>{
  scrollToBottom()
},{deep:true,immediate:true})

onMounted(()=>{
  scrollToBottom()
})
</script>

<template>
<div class="chat-message-list" ref="chatContainerRef">
  <div class="message-item" :class="item.role === leftRole ? 'message-item-left' : 'message-item-right'" v-for="(item,index) in messageData" :key="index">
    <div v-if="item.role === leftRole" class="assistant-avatar-box avatar-box" :class="avatarShape + '-avatar'">
      <slot name="assistant-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="32" height="32" viewBox="0 0 24 24"><defs><radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" id="master_svg0_51_00593" gradientTransform="translate(26.050323279646648 -1.1138226994814246) rotate(60.530599573178336) scale(29.20830725987144 28.523589051751237)"><stop offset="2.6848716583316445e-7%" stop-color="#FF915E" stop-opacity="1"></stop><stop offset="65.17199277877808%" stop-color="#8968FF" stop-opacity="1"></stop><stop offset="100%" stop-color="#0062FF" stop-opacity="1"></stop></radialGradient><radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" id="master_svg1_51_00594" gradientTransform="translate(21.672215354884656 13.912930336560294) rotate(169.15696802294656) scale(10.16872940473405 13.22443432310014)"><stop offset="0%" stop-color="#D68FCE" stop-opacity="1"></stop><stop offset="100%" stop-color="#D68FCE" stop-opacity="0"></stop></radialGradient><radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" id="master_svg2_51_00595" gradientTransform="translate(48.907199715422394 13.245236297826978) rotate(17.49200772523436) scale(13.532985755958165 21.265990875296637)"><stop offset="0%" stop-color="#B6F3FF" stop-opacity="1"></stop><stop offset="100%" stop-color="#B6F3FF" stop-opacity="0"></stop></radialGradient></defs><g><g transform="matrix(-1,0,0,1,47.99999237060547,0)"><rect x="23.999996185302734" y="0" width="23.999996185302734" height="23.999998092651367" rx="11.999998092651367" fill="url(#master_svg0_51_00593)" fill-opacity="1"></rect><rect x="23.999996185302734" y="0" width="23.999996185302734" height="23.999998092651367" rx="11.999998092651367" fill="url(#master_svg1_51_00594)" fill-opacity="0.5"></rect><rect x="23.999996185302734" y="0" width="23.999996185302734" height="23.999998092651367" rx="11.999998092651367" fill="url(#master_svg2_51_00595)" fill-opacity="0.5" data-spm-anchor-id="5176.21213303.0.i1.18d02f3dsSjeWN"></rect></g><g><path d="M2.8356830115814207,10.316085644302369L2.160156011581421,11.365305644302369L2.758493011581421,12.580625644302367Q7.482976011581421,12.538175644302369,9.845206011581421,12.516955644302367Q9.21254601158142,13.501925644302368,7.947296011581421,15.471725644302369L8.512346011581421,16.697725644302366L9.80393601158142,16.697725644302366Q11.11128601158142,14.666525644302368,11.76493601158142,13.651025644302369Q12.87065601158142,15.980725644302368,15.082156011581421,20.64002564430237L16.35345601158142,20.64002564430237L17.01515601158142,19.618125644302367L13.669056011581421,12.475355644302368L17.69835601158142,12.440355644302368Q18.13955601158142,11.763955644302369,18.36015601158142,11.425745644302369Q18.16605601158142,11.015615644302368,17.77785601158142,10.195325644302368L13.992856011581422,10.242845644302367L17.63825601158142,4.562565644302368L17.05625601158142,3.360025644302368L15.803156011581422,3.360025644302368L12.080146011581421,9.095215644302368L10.26015601158142,5.273295644302368L9.006326011581422,5.273295644302368L8.33297601158142,6.3104456443023675L10.197866011581421,10.272975644302369L2.8356830115814207,10.316085644302369Z" fill-rule="evenodd" fill="#FFFFFF" fill-opacity="1"></path></g></g></svg>
      </slot>
    </div>
    <chat-bubble
        :is-hover-bubble="false"
        :arrow-direction="item.role === leftRole ? 'left' : 'right'"
        :bubble-message="item.message"
        :bubble-background-color="item.role === leftRole ? '#fff' : '#c5ebf6'"
    >
    </chat-bubble>
    <div class="user-avatar-box avatar-box" :class="avatarShape + '-avatar'" v-if="item.role !== leftRole">
      <slot name="user-avatar">
        <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M290.816 749.056C358.4 750.08 371.2 687.104 371.2 676.352V442.496l20.48-9.728v-36.736L337.152 422.4v249.856s-1.408 46.848-46.592 44.8a80.256 80.256 0 0 1-29.568-7.168 96.64 96.64 0 0 1-22.528-23.168 85.632 85.632 0 0 1-14.208-49.152c2.432-27.648 15.744-64 45.312-108.8v-0.64c1.152-1.536 2.048-3.072 3.2-4.736s-8.704 9.088-19.968 23.68C204.8 606.208 189.184 665.6 217.6 708.736a102.4 102.4 0 0 0 6.4 8.32 72.96 72.96 0 0 0 66.688 32m145.792-65.28V349.44H435.2l26.88-11.52v-38.4l-59.904 27.392V686.336s-6.912 77.824-86.784 88.576c-79.744 2.816-88.064-32.768-90.88-32s51.2 96.128 165.12 33.024a108.288 108.288 0 0 0 47.872-92.16m371.328-274.944c-28.8-55.424-106.624-77.44-202.752-66.048l10.368 2.816c65.024-1.664 132.736 21.12 153.6 65.28 37.504 79.616-51.2 204.032-183.936 290.048V281.6l-36.608 11.008v476.288a133.632 133.632 0 0 0 23.296-9.472C751.104 666.88 857.6 501.12 808.832 408.832M564.864 217.6l-93.952 29.824v452.864s4.736 98.688-124.8 104.448c0 0 161.92 23.552 161.92-106.88V277.76l57.472-17.28z" fill="#16DBBA" p-id="13256"></path><path d="M512 25.6A486.4 486.4 0 1 1 25.6 512 486.4 486.4 0 0 1 512 25.6m0-25.6a512 512 0 1 0 512 512A512 512 0 0 0 512 0z" fill="#16DBBA"></path></svg>
      </slot>
    </div>
  </div>
  <div v-show="isShowWaiting && isFinish" class="message-item message-item-left waiting-box">
    <div class="assistant-avatar-box avatar-box" :class="avatarShape + '-avatar'">
      <slot name="assistant-waiting">
        <img class="ai-img" src="../../assets/image/admin/ai.png" alt="ai_assistant_img"/>
      </slot>
    </div>
    <div class="waiting-tip">正在获取资料...</div>
  </div>
</div>
</template>

<style scoped lang="scss">
.chat-message-list{
  box-sizing: border-box;
  position: relative;
  padding: 0 1rem 1rem;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-behavior: smooth;
  .message-item{
    margin-top: 1rem;
    display: flex;
    align-items: flex-start;
    &.message-item-left{
      justify-content: left;
    }
    &.message-item-right{
      justify-content: right;
    }
    .avatar-box{
      display: flex;
      align-items: center;
      justify-content: center;
      width: max-content;
      height: max-content;
      overflow: hidden;
      &.circle-avatar{
        border-radius: 50%;
      }
      &.square-avatar{
        border-radius: .2rem;
      }
    }
  }
  .message-item.waiting-box{
    align-items: center;
    .waiting-tip{
      padding: .8rem;
      font-size: .9rem;
      background: linear-gradient(45deg, rgba(255, 0, 169, 1), rgba(255, 251, 0, 1) 33.33%, rgba(0, 255, 127, 1) 66.67%, rgba(0, 136, 255, 1) 100%);
      background-clip: text;
      color: transparent;
      background-size: 300%;
      animation: move 10s ease-in-out infinite;
    }
    .assistant-avatar-box{
      width: 32px;
      height: 32px;
      background: linear-gradient(#5e5ee2,#e2624d);
      .ai-img{
        width: 32px;
        height: 32px;
      }
    }
  }
}
@keyframes move {
  0%{
    background-position: 300% 0;
  }
  100%{
    background-position: -300% 0;
  }
}
</style>

<script setup lang="ts">
import ChatBubble from "@/components/common/ChatBubble.vue";
import ChatAssistant from "@/components/admin/aiAssistant/ChatAssistant.vue"
import {chatAssistantStore} from "@/pinia/pinia";

const assistantPinia = chatAssistantStore();

const openChatAssistant = ()=>{
  assistantPinia.changeChatAssistant(true);
  assistantPinia.changeMaskStatus(true)
}


</script>

<template>
<div id="ai-component" >
  <div class="ai-content" @click="openChatAssistant" :class="{'ai-content-disabled': assistantPinia.isChatAssistant}">
    <div class="ai-img-box">
      <img class="ai-img" src="../../../assets/image/admin/ai.png" alt="ai_assistant_img"/>
    </div>
    <div class="ai-title">AI助理</div>
  </div>
  <chat-bubble drop-shadow-color="#6f6fca" bubble-message="您好，我是AI助理，我可以为您解决问题、推荐方案等"></chat-bubble>
  <chat-assistant></chat-assistant>
</div>
</template>

<style scoped lang="scss">
@mixin flexLayout($direction: column,$justify:center,$align:center,$flexWrap:wrap) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
  flex-wrap: $flexWrap;
}
#ai-component{
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  border-radius: 20px;
  z-index: 10;
}

#ai-component:hover .chat-bubble{
  display: flex;
}
.ai-content{
  @include flexLayout(column,flex-start,center);
  padding: .3rem .2rem 1rem .2rem;
  width: 36px;
  border-radius: 20px;
  box-shadow: 0 0 20px #6f6fca;
  cursor: pointer;
  &.ai-content-disabled{
    pointer-events: none;
  }
  .ai-img-box{
    @include flexLayout;
    border-radius: 50%;
    background: linear-gradient(#5e5ee2,#e2624d);
    .ai-img{
      width: 2rem;
      height: 2rem;
    }
  }
  .ai-title{
    margin-top: .3rem;
    width: 1rem;
    line-height: 1.2rem;
    text-align: center;
  }
}
</style>

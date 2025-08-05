<script setup lang="ts">
import ChatBubble from "@/components/common/ChatBubble.vue";
import ChatAssistant from "@/components/admin/aiAssistant/ChatAssistant.vue"
import {chatAssistantStore} from "@/pinia/pinia";
import {ElMessage} from "element-plus";
import {ref} from "vue";

const assistantPinia = chatAssistantStore();

//记录窗口吸附和浮动状态
const windowStatusForAssistant = ref(false);
//记录组件全屏和窗口化状态
const fullOrMiniStatusForAssistant = ref(false);

//助理组件顶部tool工具栏所需数据
const toolData = ref(
[{icon: 'plus', message: '新建对话'},{icon: 'setting', message: '设置'},{icon: 'window', message: '窗口吸附'},{icon: 'fullscreen', message: '窗口全屏'},{icon: 'history', message: '历史对话'}]
)

const openChatAssistant = ()=>{
  assistantPinia.changeChatAssistant(true);
  assistantPinia.changeMaskStatus(true)
}

//接收子组件发送的事件
const toolClick = (e:any)=>{
  const {eventName,ownerElement} = e
  switch(eventName){
    case 'window':
      changeAssistantDisplay(eventName,ownerElement)
      break;
    case 'fullscreen':
      changeAssistantDisplay(eventName,ownerElement)
      break;
    default:
      ElMessage({
        type: 'error',
        message: '该功能暂未实现'
      })
  }
}

//改变子组件展示方式（窗口吸附/浮动）
const changeAssistantDisplay = (name:string,e:any)=>{
  const el = document.getElementById(e.id) as HTMLElement
  const iconList = JSON.parse(JSON.stringify(toolData.value))
  if(name === 'window'){
    windowStatusForAssistant.value = !windowStatusForAssistant.value
    //点击吸附按钮时，将全屏状态初始化
    fullOrMiniStatusForAssistant.value = false
  }
  else if(name === 'fullscreen'){
    fullOrMiniStatusForAssistant.value = !fullOrMiniStatusForAssistant.value

  }
  changeAssistantClassName(name,el)


  iconList.map((item:any)=>{
    if(item.icon === 'window'){
      item.message = windowStatusForAssistant.value ? '窗口浮动' : '窗口吸附'
    }
    else if(item.icon === 'fullscreen'){
      item.message = fullOrMiniStatusForAssistant.value ? '退出全屏' : '窗口全屏'
    }
  })

  toolData.value = iconList
}

//改变子组件类名
const changeAssistantClassName = (name:string,el:any)=>{
  let windowClass = ''
  if(name === 'window'){
    windowClass = windowStatusForAssistant.value ? 'assistant-snapping' : 'assistant-float'
  }
  else if(name === 'fullscreen'){
    //点击全屏按钮时判断一下是否在吸附状态，当退出全屏时切换到普通的吸附状态
    if(windowStatusForAssistant.value && !fullOrMiniStatusForAssistant.value){
      windowClass = 'assistant-snapping'
    }
    //不在吸附状态时就正常切换全屏或不全屏状态
    else{
      windowClass = fullOrMiniStatusForAssistant.value ? 'screen-full' : 'screen-normal'
    }
  }
  el.className = `chat-assistant-s ${windowClass} `
}

//接收子组件发送的事件（初始化子组件状态）
const closeAssistant = () => {
  const iconList = JSON.parse(JSON.stringify(toolData.value))
  //点击关闭按钮时，将其它按钮状态初始化
  iconList.map((item:any)=>{
    if(item.icon === 'window'){
      item.message = '窗口吸附'
    }
    else if(item.icon === 'fullscreen'){
      item.message = '窗口全屏'
    }
  })
  windowStatusForAssistant.value = false
  fullOrMiniStatusForAssistant.value = false
  toolData.value = iconList
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
  <chat-assistant @tool-click-event="toolClick"
                  @close-assistant-event="closeAssistant"
                  :icon-data="toolData"
                  :showAside="fullOrMiniStatusForAssistant"
  >

  </chat-assistant>
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

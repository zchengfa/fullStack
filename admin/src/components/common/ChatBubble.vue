<script setup lang="ts">
import {PropType} from "vue";

defineProps({
  arrowDirection:{
    type: String as PropType<'left' | 'right' | 'top' | 'bottom'>,
    default(){
      return 'left'
    }
  },
  bubbleMessage:{
    type:String,
    default(){
      return '我是bubble默认消息文本'
    }
  },
  dropShadowColor:{
    type:String,
    default(){
      return '#c7c7d0'
    }
  },
  bubbleBackgroundColor:{
    type:String,
    default(){
      return '#fff'
    }
  },
  messageColor:{
    type: String,
    default(){
      return '#000'
    }
  },
  messageSize:{
    type: String,
    default(){
      return '.9rem'
    }
  },
  isHoverBubble:{
    type: Boolean as PropType< true | false >,
    default(){
      return true
    }
  },
  showArrow:{
    type: Boolean as PropType< true | false >,
    default(){
      return true
    }
  }
})

</script>

<template>
<div class="chat-bubble" :class="isHoverBubble ? 'hover-bubble arrow-' + arrowDirection : 'normal-bubble arrow-' + arrowDirection" :style="{'--shadow-color':dropShadowColor,'--bubbleBGColor':bubbleBackgroundColor}">
  <div v-if="showArrow" class="bubble-arrow"></div>
  <div class="bubble-message-box" :style="{'--message-color':messageColor,'--message-size':messageSize}">{{bubbleMessage}}</div>
</div>
</template>

<style scoped lang="scss">
$bubbleBGC: var(--bubbleBGColor);
.chat-bubble.hover-bubble{
  display: none;
  position: absolute;
  z-index: 9;
  &.arrow-left{
    left: 100%;
    bottom: 50%;
    transform: translateY(50%);
  }
  &.arrow-right{
    right: 100%;
    bottom: 50%;
    transform: translateY(50%);
  }
  &.arrow-top{
    left: 50%;
    bottom: 0;
    transform: translateX(-50%) translateY(100%);
  }
  &.arrow-bottom{
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
  .bubble-message-box{
    width: max-content;
    max-width: 13rem;
  }
}
.chat-bubble.normal-bubble{
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  .bubble-message-box{
    max-width: 80%;
  }
  .bubble-arrow{
    top: 16px;
    transform: translateY(-50%);
  }
}
.chat-bubble{
  justify-content: center;
  align-items: center;
  filter: drop-shadow(2px 2px 5px var(--shadow-color));
  &.arrow-left{
    flex-direction: row;
    .bubble-arrow{
      left: 2px;
      border-right-color: $bubbleBGC;
    }
  }
  &.arrow-right{
    flex-direction: row-reverse;
    .bubble-arrow{
      left: -2px;
      border-left-color: $bubbleBGC;
    }
  }
  &.arrow-top{
    flex-direction: column;
    .bubble-arrow{
      top: 2px;
      border-bottom-color: $bubbleBGC;
    }
  }
  &.arrow-bottom{
    flex-direction: column-reverse;
    .bubble-arrow{
      top: -2px;
      border-top-color: $bubbleBGC;
    }
  }
  .bubble-message-box{
    min-height: 1rem;
    padding: .6rem .8rem;
    border-radius: .3rem;
    background: $bubbleBGC;
    text-align: left;
    font-size: var(--message-size);
    color: var(--message-color);
  }
  .bubble-arrow{
    position: relative;
    border: 10px solid transparent;
  }
}
</style>

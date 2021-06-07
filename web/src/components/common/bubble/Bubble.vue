<template>
  <div class="message-bubble" v-show="showCount">
    <div class="content">
      <span class="count">{{count}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageBubble",
  props:{
    count: {
      type:Number,
      default() {
        return 0
      }
    }
  },
  computed:{
    showCount(){
      return this.count !== 0
    }
  }
}
</script>

<style scoped>
.message-bubble {
  position: absolute;
  left: 65%;
  width: 1rem;
  height: 1rem;
  background-color: #e02929 !important;
  color: #fff;
  border-radius: 50%;
  line-height: 1rem;
}
</style>
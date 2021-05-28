<template>
  <div class="message-bubble" v-if="bubble">
    <div class="content">
      <span class="count">{{count}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageBubble",
  props:{
    count:{
      type:Number,
      default() {
        return 0
      }
    }
  },
  computed:{
    bubble(){
      return this.count !== 0
    }
  }
}
</script>

<style scoped>

</style>
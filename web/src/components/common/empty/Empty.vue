<template>
  <div class="empty">
    <div class="message">
      <div class="image-box"><img src="~assets/image/empty/empty.png" alt="empty_image"></div>
      <div>{{emptyMessage}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Empty",
  props:{
    emptyMessage:{
      type:String,
      default(){
        return '空空如也...'
      }
    }
  }
}
</script>

<style scoped>
.empty{
  position: relative;
  top:0;
  width: 100%;
  text-align: center;
  background-color: #f1eaea;
}
.image-box{
  margin-bottom: 1rem;
}
.message{
  width: 100%;
  height: 100%;
  font-family: cursive ;
  color: #a5a2a2;
}
</style>
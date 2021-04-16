<template>
  <div class="empty" v-if="isShow">
    <div class="message">
      <div class="image-box"><img src="~assets/image/empty/empty.png" alt="empty_image"></div>
      <div>{{message}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Empty",
  data(){
    return {
      message:'',
      isShow:false
    }
  },
  methods:{
    showEmpty(message=''){
      this.message = message
      this.isShow = true
    },
    removeEmpty(){
      this.isShow = false
    }
  }
}
</script>

<style scoped>
.empty{
  position: absolute;
  top:44px;
  width: 100vw;
  height: 30vh;
  text-align: center;
  background-color: #f1eaea;
}
.image-box{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.message{
  width: 100%;
  height: 100%;
  font-family: cursive;
  color: #a5a2a2;
}
</style>
<template>
  <div class="toast" v-show="isShow">
    <div class="message-box">
      <span>{{message}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  data(){
    return{
      message:'',
      isShow:false
    }
  },
  methods:{
    showToast(message='请输入弹框内容',duration=1000){
      this.isShow = true
      this.message = message

      setTimeout(() => {
        this.isShow = false
        this.message = ''
      },duration)
    }
  }
}
</script>

<style scoped>
.toast{
  position: fixed;
  top:50%;
  left: 50%;
  background-color: #3e3c3c;
  transform: translate(-50%,-50%);
  z-index: 999;
}
span{
  display: inline-block;
  padding: .6rem;
  color: #fff;
  font-size: .8rem;
  font-weight: bold;
}
</style>
<template>
  <div class="toast" v-show="isShow">
    <div class="message-box">
      <span><span class="tip">{{title}}</span>{{message}}</span>
      <button class="know" @click="know">知道了({{time}})</button>
    </div>

  </div>
</template>

<script>
export default {
  name: "Toast",
  data(){
    return{
      message:'',
      isShow:false,
      time:null,
      timerInterval:null,
      timerTimeOut:null,
      title:''
    }
  },
  methods:{
    showToast(message='请输入弹框内容',duration=3000,title='温馨提示:'){
      clearInterval(this.timerInterval)
      this.isShow = true
      this.message = message
      this.title = title
      this.time = duration/1000
      this.timerInterval = setInterval(()=>{
        this.time --
        if (this.time <= 0){
          clearInterval(this.timerInterval)
        }
      },1000)
      this.timerTimeOut = setTimeout(() => {
        this.isShow = false
        this.message = ''
        this.title = ''
        clearInterval(this.timerInterval)
      },duration + 1000)
    },
    know(){
      this.isShow = false
      this.message = ''
      this.title = ''
      clearInterval(this.timerInterval)
      clearTimeout(this.timerTimeOut)
    }
  }
}
</script>

<style scoped>
.toast{
  position: fixed;
  top:0;
  left: 0;
  width: 100vw;
  height: 100vh;
  border-radius: .5rem;
  background-color: transparent;

  z-index: 999;
}
.message-box{
  position: relative;
  top:50%;
  margin-left: 50%;
  min-width: 10rem;
  background-color: #fff;
  transform: translate(-50%,-50%);
  box-shadow: .2rem .2rem #cbc7c7;
}
.tip{
  font-weight: bold;
  color: #fd001e;
}
span{
  display: inline-block;
  padding: .6rem;
  font-size: .9rem;
  text-align: center;
  line-height: 150%;
}
button{
  margin: .5rem 0 1rem 50%;
  padding: .3rem 1rem;
  min-width: 6rem;
  color: #fff;
  font-size: .9rem;
  background-color: #fd001e;
  border-radius: 1rem;
  transform: translateX(-50%);
}
</style>
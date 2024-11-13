<template>
  <div class="toast" id="MessageToast" v-show="isShow">
    <div class="message-box">
        <span class="tip">{{title}}</span>
      <span class="msg">{{message}}</span>
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
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top:0;
    left: 50%;
    width: 100%;
    max-width: var(--app-max-width);
    height: 100vh;
  transform: translateX(-50%);
    background-color: rgba(0,0,0,.3);
    z-index: 999;
}
.message-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    width: 30%;
    min-width: 15rem;
    background-color: #fff;
    border-radius: 6px;
}
.message-box span{
    padding: 10px;
}
.know{
    padding: 8px 16px;
    margin-top: 10px;
    border: none;
    border-radius: 6px;
    background-color: #dc1561;
    color: #fff;
    transform: scale(.9);
}
.msg{
    color: #7e7878;
    font-size: 14px;
    text-align: center;
    line-height: 1.2rem;
}
</style>
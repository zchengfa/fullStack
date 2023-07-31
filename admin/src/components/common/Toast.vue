<template>
  <div class="toast" v-show="toast.isShow">
    <div class="message-box">
      <span class="tip">{{toast.title}}</span>
      <span class="msg">{{toast.message}}</span>
      <button class="know" @click="know">知道了({{toast.time}})</button>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent,reactive } from "vue"
export default defineComponent( {
  name: "Toast",
  setup(){
    let toast = reactive({
        message:<string>'',
        isShow:<boolean>false,
        time:<number>0,
        timerInterval:<number | undefined>undefined,
        timerTimeOut:<number | undefined>undefined,
        title:''
    })

    const showToast = (message='请输入弹框内容',duration=3000,title='温馨提示:')=>{
      clearInterval(toast.timerInterval)
      toast.isShow = true
      toast.message = message
      toast.title = title
      toast.time = duration/1000
      toast.timerInterval = setInterval(()=>{
        toast.time --
        if (toast.time <= 0){
          clearInterval(toast.timerInterval)
        }
      },1000)
      toast.timerTimeOut = setTimeout(() => {
        toast.isShow = false
        toast.message = ''
        toast.title = ''
        clearInterval(toast.timerInterval)
      },duration + 1000)
    }
    
    const know = ()=>{
      toast.isShow = false
      toast.message = ''
      toast.title = ''
      clearInterval(toast.timerInterval)
      clearTimeout(toast.timerTimeOut)
    }

    return {
        toast,
        showToast,
        know
    }
  }
})
</script>

<style scoped>
.toast{
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top:0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  background-color: #15dcc5;
  color: #fff;
}
.msg{
  color: #7e7878;
  font-size: 14px;
}
</style>
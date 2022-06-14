<template>
  <div class="toast" v-show="toast.isShow">
    <div class="message-box">
      <span><span class="tip">{{toast.title}}</span>{{toast.message}}</span>
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
        timerTimeOut:<number|undefined>undefined,
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
  width: 15%;
  min-width: 15rem;
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
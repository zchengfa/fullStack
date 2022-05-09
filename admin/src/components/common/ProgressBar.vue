<template>
<div class="progress-bar">
  <div class="bar-bg"></div>
  <div class="progress"></div>
</div>
</template>

<script lang="ts">
import {defineComponent,reactive,onMounted,toRefs} from "vue";

export default defineComponent({
  name: "ProgressBar",
  props:['progress','item'],
  setup(props){
    onMounted(()=>{
      const {progress,item} = toRefs(props)
      
      let barPercent = progress.value/100
      let progressBar =<HTMLElement> document.getElementsByClassName('progress').item(item.value)
      let barBox = <HTMLElement> document.getElementsByClassName('progress-bar').item(item.value)

      if (barBox.clientWidth){
        let rgb = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
        progressBar.style.width = '0'
        progressBar.style.backgroundColor = rgb
        let currentPercent = 0
        let timer = setInterval(()=>{
          
          if (progressBar.clientWidth >= barBox.clientWidth *barPercent && progressBar.clientWidth !==0){
            clearInterval(timer)
          }
          else {
            currentPercent += 0.04
            progressBar.style.width = currentPercent*100 + '%'
          }
        },60)

      }
    })
  }
})
</script>

<style scoped>
.progress-bar{
  position: relative;
  width: 100%;
  height: 12px;
  overflow: hidden;
}
.progress-bar div{
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 6px;
}
.bar-bg{
  background-color: #8a8686;
}
</style>
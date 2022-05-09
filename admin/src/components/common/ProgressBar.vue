<template>
<div class="progress-bar" v-if="$props.barType!=='circle'">
  <div class="bar-bg"></div>
  <div class="progress"><span class="percent">{{percent.currentPercent}}</span></div>
</div>
<div v-else class="circle-progress-bar">
  <div class="bar-bg">
    <div class="second-circle"></div>
    <div class="first-circle"></div>
    <div class="mask"><span>{{percent.currentPercent}}</span></div>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent, reactive, onMounted, toRefs} from "vue";

export default defineComponent({
  name: "ProgressBar",
  props:['progress','item','barType','circleBorderColor','circleProgressColor','circleTextColor'],
  setup(props){
    let percent = reactive({
      currentPercent:<string>'0%'
    })
    onMounted(()=>{
      const {progress,item,barType,circleBorderColor,circleProgressColor,circleTextColor} = toRefs(props)

      let barPercent = progress.value

      if (barType.value!=='circle'){
        let progressBar =<HTMLElement> document.getElementsByClassName('progress').item(item.value)
        let barBox = <HTMLElement> document.getElementsByClassName('progress-bar').item(item.value)
        let percentEl = <HTMLElement> document.getElementsByClassName('percent').item(item.value)
        if (barBox.clientWidth){
          let rgb = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
          progressBar.style.width = '0'
          progressBar.style.backgroundColor = rgb
          let currentPercent = 0
          let timer = setInterval(()=>{

            if (currentPercent>=barPercent){
              percent.currentPercent = barPercent+'%'
              clearInterval(timer)
            }
            else {
              currentPercent += 1
              progressBar.style.width = currentPercent + '%'
              percent.currentPercent = currentPercent + '%'
              percentEl.style.left = progressBar.clientWidth + 'px'
              if (currentPercent>=90){
                percentEl.style.left = 80+'%'
                percentEl.style.color = '#fff'
              }
            }
          },20)

        }
      }
      else{
        function changeCircleProgress(item:any){
          console.log(arguments[Symbol.iterator])
          let circleElOne =<HTMLElement> document.getElementsByClassName('first-circle').item(item.value)
          let circleElTwo =<HTMLElement> document.getElementsByClassName('second-circle').item(item.value)
          let clipWidth = (circleElOne.clientWidth)/2 + 'px'
          circleElOne.style.clip=`rect(auto,${clipWidth},auto,auto)`
          circleElTwo.style.clip=`rect(auto,auto,auto,${clipWidth})`
          let currentPercent = 0
          let timer = setInterval(()=>{
            currentPercent++
            if (currentPercent>barPercent){
              clearInterval(timer)
            }
            else{
              percent.currentPercent  = currentPercent+'%'
              if (currentPercent<=50){
                circleElTwo.style.transform = `rotate(${currentPercent*3.6}deg)`
              }
              else if(currentPercent>50&&currentPercent<100){
                circleElTwo.style.transform = `rotate(0deg)`
                circleElTwo.style.backgroundColor = '#d52121'
                circleElTwo.style.transform = `rotate(${(currentPercent-50)*3.6}deg)`
              }
              else {
                circleElOne.style.backgroundColor = '#d52121'
              }
            }
          },20)
        }
        changeCircleProgress(item)
        window.addEventListener('resize',()=>{
          changeCircleProgress(item)
        })
      }

    })

    return {
      percent
    }
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
  background-color: #ece6e6;
}
span.percent{
  position: absolute;
  top: 0;
  display: inline-block;
  height: 100%;
  z-index: 9;
  font-size: 12px;
  line-height: 12px;
}
.circle-progress-bar,.bar-bg,.first-circle,.second-circle,.mask{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.circle-progress-bar .bar-bg{
  position: relative;
  background-color: #d52121;
}
.second-circle,.first-circle,.mask{
  position: absolute;
}
.second-circle{
  background-color: #1e8efc;
  z-index: 9;
}
.first-circle{
  background-color: #1e8efc;
  z-index: 8;
}
.mask{
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;

  background-color: #1efc43;
  transform: translate(-50%,-50%);
  z-index: 10;
}
.mask span{
  display: inline-block;
  position: relative;
  top:50%;
  font-size: 24px;
  font-weight: bold;
  transform: translateY(-50%);
}
</style>
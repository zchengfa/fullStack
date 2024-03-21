<script setup lang="ts">
import {onMounted, ref, getCurrentInstance, ComponentInternalInstance, computed, onBeforeUnmount} from "vue";
const {props} = getCurrentInstance() as ComponentInternalInstance
//定义默认颜色
defineProps({
  containerBG:{
    default(){
      return '#3054c7'
    }
  },
  centerBG:{
    default(){
      return '#fff'
    }
  },
  semicircleBG:{
    default(){
      return '#c59de0'
    }
  },
  percent:{
    default(){
      return 0
    }
  },
  item:{
    default(){
      return 0
    }
  },
  label:{
    default(){
      return undefined
    }
  }
})

let animateId:any= ref(0)
let currentAngle:any = ref(undefined)
let el = ref()

const animate = ()=>{
  //获取元素旋转角度
  currentAngle.value = getRotateAngle(el.value)
  //旋转超过180度
  if(currentAngle.value>180){
    let maskEl:any = document.getElementsByClassName('semicircle-mask').item(((props.item) as number))
    let semicircleOneEl:any = document.getElementsByClassName('semicircle-one').item((props.item) as number)
    maskEl.style.zIndex = '3'
    semicircleOneEl.style.zIndex = '-1'
    semicircleOneEl.style.backgroundColor = props.containerBG
  }
  animateId.value = window.requestAnimationFrame(animate)
}

//获取目标元素的旋转角度
const getRotateAngle = (element:any)=>{
  const com:any = window.getComputedStyle(element)
  const matrix = com.getPropertyValue('transform')
  const arr = matrix.split(',')
  const a = Number(arr.slice(0,1).toString().split('(').splice(1)[0])
  const b = Number(arr.slice(1,2))
  //const scale = Math.sqrt(a*a+b*b)
  //let sin = b/scale
  let realAngle: number
  let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  angle >= 0 ? realAngle = angle : realAngle = angle+360

  return realAngle
}
//设置元素某些样式
const setStyle = (el:string[],style:number[],attr:any[])=>{
  el.forEach((item:any,index:number)=>{
    const itemEl:any = document.getElementsByClassName(item).item((props.item) as number)
    if(style[index] === 0){
      itemEl.style.backgroundColor = attr[index]
    }
    else if(style[index] === 1){
      itemEl.style.color = attr[index]
    }
  })
}
//计算要旋转的最终角度
const rotateAngle = computed(()=>{
  const p = (props.percent) as number
  return '--percent:' + (360 * (p/100)) +'deg'
})

//计算当前进度
const currentProgress = computed(()=>{
  return Math.ceil(Number(((currentAngle.value * 100) / 360).toFixed(2)))
})

onMounted(()=>{
  //挂载后拿到旋转元素
  el.value = document.getElementsByClassName('semicircle-two').item((props.item) as number)

  //为元素设置颜色
  setStyle(['progress-box','progress-center','semicircle-one','semicircle-two','semicircle-mask','progress-text','character'],
    [0,0,0,0,0,1,1],
    [props.containerBG,props.centerBG,props.semicircleBG,props.semicircleBG,props.containerBG,props.containerBG,props.containerBG])

  animateId.value = window.requestAnimationFrame(animate)
  window.addEventListener('animationend',()=>{
    //动画结束，关闭关键帧动画
    window.cancelAnimationFrame(animateId.value)
  })
})

onBeforeUnmount(()=>{
  //组件卸载前移除事件监听、关闭关键帧动画
  window.removeEventListener('animationend',()=>{})
  window.cancelAnimationFrame(animateId.value)
})
</script>

<template>
  <div class="progress-container">
    <label class="progress-title" v-if="props.label">{{props.label}}</label>
    <div class="progress-box">
      <div class="progress-center">
        <span class="progress-text">{{currentProgress}}</span>
        <span class="character">%</span>
      </div>
      <div class="semicircle-one"></div>
      <div class="semicircle-two" :style="rotateAngle"></div>
      <div class="semicircle-mask"></div>
    </div>
  </div>
</template>

<style scoped>
.character{
  font-size: 12px;
}
.progress-container{
  position: relative;
  .progress-title{
    display: inline-block;
    position: absolute;
    top: -30%;
    left: 0;
    width: 100%;
    font-size: .8rem;
    font-weight: bold;
  }
}
.progress-box{
  position: relative;
  margin: 0 auto;
  width: 100%;
  min-width: 4rem;
  min-height: 4rem;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  &:hover{
    transform: scale(1.1);
    box-shadow: #dcd8d8 0 0 10px 10px;
    transition: transform .5s;
  }
}

.progress-center{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  margin: 10%;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  z-index:10
}
.semicircle-one,.semicircle-two{
  position: absolute;
  width: 50%;
  height: 100%;
  z-index:1;
  transform-origin: 0 50%;
}
.semicircle-one{
  border-radius: 100% 0 0 100%;
}
.semicircle-two{
  left: 50%;
  border-radius: 0 100% 100% 0;
  animation: rotate linear 1s;
  animation-fill-mode: forwards;
}
.semicircle-mask{
  position: absolute;
  width: 50%;
  height: 100%;
  left: 50%;
  border-radius: 0 100% 100% 0;
  z-index:-1
}
@keyframes rotate {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(var(--percent));
  }
}
</style>
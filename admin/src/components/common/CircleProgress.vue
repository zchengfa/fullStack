<script setup lang="ts">
import {
  onMounted,
  UnwrapRef,
  Ref,
  ref,
  getCurrentInstance,
  ComponentInternalInstance,
  computed,
  onBeforeUnmount,
  reactive
} from "vue";
const {props} = getCurrentInstance() as ComponentInternalInstance
//定义默认颜色
defineProps({
  breathe:{
    type:Boolean,
    default(){
      return false
    }
  },
  containerBG:{
    default(){
      return '#ded9d9'
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
  },
  progressType:{
    default(){
      return 'circle'
    }
  }
})

let animateId:Ref<UnwrapRef<number> >= ref(0)
let currentAngle:Ref<UnwrapRef<any> > = ref(undefined)
let el:Ref<UnwrapRef<any> > = ref()

//条形进度条相关元素变量
let barEl:Ref<UnwrapRef<any> > = ref()
let normalEl:Ref<UnwrapRef<any> > = ref()
let barStyleObj = reactive({
  "--bar-color":`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`,
  "--progress": props.percent + '%',
})

const animate = ()=>{
  animateId.value = window.requestAnimationFrame(animate)
  if(props.progressType === 'circle'){
    //获取元素旋转角度
    currentAngle.value = getRotateAngle(el.value)
    //旋转超过180度
    if(currentAngle.value>180){
      let maskEl =<HTMLElement> document.getElementsByClassName('semicircle-mask').item(((props.item) as number))
      let semicircleOneEl:any =<HTMLElement> document.getElementsByClassName('semicircle-one').item((props.item) as number)
      maskEl.style.zIndex = '3'
      semicircleOneEl.style = {
        zIndex:'-1',
        backgroundColor:props.containerBG
      }
    }
  }
  else if(props.progressType === 'normal'){
    //条形进度条元素
    let percent = Math.round((barEl.value.clientWidth/normalEl.value.clientWidth)*100)
    //设置伪元素content内容
    barEl.value.attributes[1].value = percent + '%'

    //值相等，动画可以结束了
    if(Number(percent)=== Number(props.percent)){
      window.cancelAnimationFrame(animateId.value)
    }
  }

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
    const itemEl =<HTMLElement> document.getElementsByClassName(item).item((props.item) as number)
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
  if(props.progressType === 'circle'){
    //挂载后拿到旋转元素
    el.value =<HTMLElement> document.getElementsByClassName('semicircle-two').item((props.item) as number)

    //为元素设置颜色
    setStyle(['progress-box','progress-center','semicircle-one','semicircle-two','semicircle-mask','progress-text','character'],
      [0,0,0,0,0,1,1],
      [props.containerBG,props.centerBG,props.semicircleBG,props.semicircleBG,props.containerBG,props.containerBG,props.containerBG])
    window.addEventListener('animationend',()=>{
      //动画结束，关闭关键帧动画
      window.cancelAnimationFrame(animateId.value)
    })

  }
  else if(props.progressType === 'normal'){
    barEl.value = <HTMLElement> document.getElementsByClassName('progress-bar-normal').item((props.item) as number)
    normalEl.value = <HTMLElement> document.getElementsByClassName('normal-progress').item((props.item) as number)
  }
  animateId.value = window.requestAnimationFrame(animate)

})

onBeforeUnmount(()=>{
  //组件卸载前移除事件监听、关闭关键帧动画
  window.removeEventListener('animationend',()=>{})
  window.cancelAnimationFrame(animateId.value)
})
</script>

<template>
  <div class="progress-container">
    <div class="circle-progress" v-if="props.progressType === 'circle'">
      <label class="progress-title" v-if="props.label">{{props.label}}</label>
      <div class="progress-box" :class="{'breathe':props.breathe}">
        <div class="progress-center">
          <span class="progress-text">{{currentProgress}}</span>
          <span class="character">%</span>
        </div>
        <div class="semicircle-one"></div>
        <div class="semicircle-two" :style="rotateAngle"></div>
        <div class="semicircle-mask"></div>
      </div>
    </div>
    <div class="normal-progress" v-else-if="props.progressType === 'normal'" :style="{'--bar-bg-color':props.containerBG}">
      <div class="progress-bar-normal" data-content-after="0%" :style="barStyleObj"></div>
    </div>
  </div>
</template>

<style scoped>
.character{
  font-size: .8rem;
}
.progress-container{
  position: relative;
  cursor: pointer;
  .progress-title{
    display: inline-block;
    position: absolute;
    top: -30%;
    left: 0;
    width: 100%;
    font-size: .8rem;
    font-weight: bold;
  }
  .circle-progress,.normal-progress{
    width: 100%;
    height: 100%;
  }
}
/*圆形进度条相关样式*/
.progress-box{
  position: relative;
  margin: 0 auto;
  width: 100%;
  min-width: 2rem;
  min-height: 2rem;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  &:hover{
    transform: scale(1.1);
    box-shadow: #dcd8d8 0 0 10px 10px;
    transition: transform .5s;
  }
}
.breathe{
  animation: breathe 2s ease-out infinite;
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
.progress-text{
  font-size: 1rem;
}
@keyframes rotate {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(var(--percent));
  }
}
@keyframes breathe {
  0% {
    box-shadow: 0 0 10px rgba(212, 202, 202, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 20px rgba(233, 218, 218, 0.6);
    transform: scale(1.1);
  }
  100% {
    box-shadow: 0 0 10px rgba(228, 221, 221, 0.3);
    transform: scale(1);
  }
}
/*条形进度条相关样式*/
.normal-progress{
  position: relative;
  min-width: 1rem;
  min-height: 4px;
  border-radius: 3rem;
  background-color: var(--bar-bg-color);
  &:hover{
    transform: scale(1.1);
    box-shadow: #dcd8d8 0 0 2px 2px;
    transition: transform .5s;
  }
  .progress-bar-normal{
    position: relative;
    width: 0;
    height: 100%;
    background-color: var(--bar-color);
    border-radius: inherit;
    animation: beLong 1s ease-in;
    animation-fill-mode: forwards;
  }
  .progress-bar-normal::after{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 100%;
    height: 100%;
    content:attr(data-content-after);
  }
}
@keyframes beLong {
  0%{
    width:0;
  }
  100%{
    width: var(--progress);
  }
}
</style>

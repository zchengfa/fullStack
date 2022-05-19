<template>
<div class="progress-bar" v-if="$props.barType!=='circle'">
  <div class="bar-bg"></div>
  <div class="progress"><span class="percent">{{percent.currentPercent}}</span></div>
</div>
<div v-else class="circle-progress-bar">
  <div class="bar-bg">
    <div class="second-circle"></div>
    <div class="first-circle"></div>
    <div class="mask">
      <div>
        <span v-if="percent.label" class="mask-label">{{percent.label}}</span>
        <span class="circle-percent">{{percent.currentPercent}}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent, reactive, onMounted, toRefs} from "vue";

export default defineComponent({
  name: "ProgressBar",
  props:['progress','item','barType','circleBorderColor','circleProgressColor','circleTextColor','maskColor','loadingSpeed','label'],
  setup(props){
    let percent = reactive({
      currentPercent:<string>'0%',
      label:<string>''
    })
    onMounted(()=>{
      const {progress,item,barType,circleBorderColor,circleProgressColor,circleTextColor,maskColor,loadingSpeed,label} = toRefs(props)

      let barPercent = progress.value
			
			let speed:number = loadingSpeed.value

      if (barType.value!=='circle'){

        let progressBar =<HTMLElement> document.getElementsByClassName('progress').item(item.value)
        let barBox = <HTMLElement> document.getElementsByClassName('progress-bar').item(item.value)
        let percentEl = <HTMLElement> document.getElementsByClassName('percent').item(item.value)
        if (barBox.clientWidth){
          //随机生成滚动条的颜色
          let rgb = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
          progressBar.style.width = '0'
          progressBar.style.backgroundColor = rgb
          let currentPercent = 0
          //设置定时器
          let timer = setInterval(()=>{

            //当百分比大于等于时，清除定时器，百分比显示给定的百分比
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
          },speed)
        }
      }
      else{
        //获取圆1与圆2
        let circleElOne =<HTMLElement> document.getElementsByClassName('first-circle').item(item.value)
        let circleElTwo =<HTMLElement> document.getElementsByClassName('second-circle').item(item.value)
        let circleElBig =<HTMLElement> document.getElementsByClassName('bar-bg').item(item.value)
        let percentEl = <HTMLElement> document.getElementsByClassName('circle-percent').item(item.value)
        let maskEl = <HTMLElement> document.getElementsByClassName('mask').item(item.value)

        let CBColor:string,CTColor:string,CPColor:string,MaskColor:string

        CBColor = setDefaultColor(circleBorderColor,'gray')
        CTColor = setDefaultColor(circleTextColor,'red')
        CPColor = setDefaultColor(circleProgressColor,'#fff')
        MaskColor = setDefaultColor(maskColor,'pink')

        percent.label = label.value
        //没有label值时百分比元素paddingTop为0
        if (!label.value){
          percentEl.style.paddingTop = '0px'
        }

        function setDefaultColor(selfColor:any,defaultColor:string){
          if (selfColor.value===undefined){
            return defaultColor
          }
          else if(!selfColor.value.length){
            throw new Error(`your ${selfColor['_key']} cannot be empty!`)
          }
          else{
            return  selfColor.value
          }
        }

        circleElBig.style.background = CBColor
        maskEl.style.background = MaskColor
							
				//设置圆形进度条中百分比字体颜色
        percentEl.style.color = CTColor

        //设置两个半圆
        function changeCircleClip(circleOne:HTMLElement,circleTwo:HTMLElement) {
          //利用clip属性对整圆进行裁剪成半圆
          let clipWidth = (circleOne.clientWidth)/2 + 'px'
          circleOne.style.clip=`rect(auto,${clipWidth},auto,auto)`
          circleTwo.style.clip=`rect(auto,auto,auto,${clipWidth})`
        }
        function changeCircleProgress(barPercent:number){
          changeCircleClip(circleElOne,circleElTwo)
          let currentPercent = 0

          //设定定时器
          let timer = setInterval(()=>{

            //设定每过一段时间就使百分比加1%
            currentPercent++

            //当当前百分比大于给定的百分比时清除定时器
            if (currentPercent>barPercent){
              clearInterval(timer)
            }
            else{
              //将百分比加载情况赋给显示百分比的变量
              percent.currentPercent  = currentPercent+'%'

              //当百分比在50%及以内时，每1%就让圆2转动3.6度
              if (currentPercent<=50){
                circleElOne.style.background = CPColor
                circleElTwo.style.background = CPColor
                circleElTwo.style.transform = `rotate(${currentPercent*3.6}deg)`
              }
              //百分比超过50小于100时，先让圆2的旋转角度恢复到初始状态，然后将圆2的背景颜色设置成与大圆背景颜色一致后再进行旋转
              else if(currentPercent>50&&currentPercent<100){
                circleElTwo.style.transform = `rotate(0deg)`
                circleElTwo.style.background = CBColor
                circleElTwo.style.transform = `rotate(${(currentPercent-50)*3.6}deg)`
                if (!circleElTwo.style.background){
                  throw new Error(`your circleBorderColor value is invalid!`)
                }
              }
              //当达到100时，将圆1的背景颜色设置成与大圆背景一致的颜色，形成加载100%的效果
              else {
                circleElOne.style.background = CBColor
              }
            }
          },speed)
        }
        changeCircleProgress(barPercent)

        window.addEventListener('resize',()=>{
          //当窗口大小改变时，裁剪的大小也要改变
          changeCircleClip(circleElOne,circleElTwo)
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
}
.second-circle,.first-circle,.mask{
  position: absolute;
}
.second-circle{
  z-index: 9;
}
.first-circle{
  z-index: 8;
}
.mask{
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%,-50%);
  z-index: 10;
}
.mask span.circle-percent{
  padding-top: 12px;
}
.mask div{
  position: relative;
  top:50%;
  width: auto;
  height: auto;
  transform: translateY(-50%);
}
.mask div span{
  display: block;
}
@media screen and (max-width: 500px){
  .mask span.circle-percent{
    font-size: 1rem;
  }
}
</style>
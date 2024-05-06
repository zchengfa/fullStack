<template>
 <div class="data-visualization-container" ref="dataVisualizationRef">
   <BorderBox11 title="Mall数据可视化大屏">
      <div class="container">
        <!-- 大屏左边部分 -->
        <div class="visualization-left visualization-box">
          <div class="left-top left-item">
            <div class="modules-header">
              <span class="modules-title">销售数据</span>
              <span class="modules-title-en">Sell Data</span>
            </div>
            <div class="sell-data">
              <div class="sell-header">
                <span class="sell-title">销售量</span>
                <span class="unit">万元</span>
              </div>
              <div class="sell">233324546.05</div>
            </div>
            <div class="percent-box">
              <span>完成度</span>
              <circle-progress class="sell-progress-bar" :item="0" progress-type="normal" :percent="87"></circle-progress>
            </div>
          </div>
          <div  class="left-bottom left-item">
            <div class="modules-header">
              <span class="modules-title">关键词搜索排行榜</span>
              <span class="modules-title-en">Words Rank</span>
            </div>
            <div class="rank-box">
              <infinite-scroll :scroll-data="scrollData" :property-data="propertyData" :header-data="headerData"></infinite-scroll>
            </div>
          </div>
        </div>
        <!-- 大屏中间部分 -->
        <div class="visualization-center visualization-box">
          <div class="charts-box"><bar-chart-two class="order-chart"></bar-chart-two></div>
          <div class="charts-box"><earth></earth></div>
        </div>
        <!-- 大屏右边部分 -->
        <div class="visualization-right visualization-box">
          <div class="modules-header">
              <span class="modules-title">统计数据</span>
              <span class="modules-title-en">Statistics Data</span>
          </div>
          <div class="right-top">
            <div class="right-top-item" >
              <circle-progress container-b-g="#bababa" center-b-g="#000" semicircle-b-g="#0e1040" class="circle-pro" :breathe="true" :item="0" :percent="53"></circle-progress>
              <div class="info" >
                <span>32.9</span>
                <span>订单总数（万）</span>
              </div>
            </div>
            <div class="right-top-item" >
              <circle-progress container-b-g="rgb(215 215 71)" center-b-g="#0e1040" semicircle-b-g="#0e1040" class="circle-pro" :breathe="true" :item="1" :percent="76"></circle-progress>
              <div class="info" >
                <span>1.2</span>
                <span>销售总量（万元）</span>
              </div>
            </div>
            <div class="right-top-item" >
              <circle-progress container-b-g="rgb(217 106 132)" center-b-g="#0e1040" semicircle-b-g="#0e1040" class="circle-pro" :breathe="true" :item="2" :percent="34"></circle-progress>
              <div class="info" >
                <span>54</span>
                <span>人均消费</span>
              </div>
            </div>
            <div class="right-top-item" >
              <circle-progress container-b-g="#bababa" center-b-g="#000" semicircle-b-g="#0e1040" class="circle-pro" :breathe="true" :item="3" :percent="59"></circle-progress>
              <div class="info" >
                <span>12</span>
                <span>近期新增订单数（万）</span>
              </div>
            </div>
          </div>
          <div class="right-bottom">
            <pie-rose-chart class="pie-rose-chart" ></pie-rose-chart>
          </div>
            
        </div>
      </div>  
   </BorderBox11>
 </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue';
import CircleProgress from '../../common/CircleProgress.vue';
import BarChartTwo from './BarChartTwo.vue'
import PieRoseChart from './PieRoseChart.vue'
import {BorderBox11} from "@dataview/datav-vue3";
import InfiniteScroll from "../../common/InfiniteScroll.vue";
import {getStatisticsData} from "../../../network/request";
import Earth from "./Earth.vue";

let dataVisualizationRef = ref(null)

const scrollData = ref([]);
const headerData = ref(['排名','关键词','次数'])
const propertyData = ref(['word','search_count'])
function getSData(){
  getStatisticsData().then(res=>{
    scrollData.value = res.data[2].words
  })
}
getSData()

//获取缩放比例
const getScale = (w=1440,h=720)=>{
  let ww = window.innerWidth;
  let wh = window.innerHeight;
  //根据屏幕变化获得的适配比例
  return  ww / wh < w/h ? ww / w : wh / h
}

//缩放
const setTransformScreen = (el:HTMLElement)=>{
  el.style.transform = `scale(${getScale()})`
}

onMounted(()=>{
  if(dataVisualizationRef.value){
    const element = (dataVisualizationRef.value) as HTMLElement
    setTransformScreen(element)
    window.onresize = ()=>{
      setTransformScreen(element)
    }
  }

})
onBeforeUnmount(()=>{
  window.onresize = null
})
</script>

<style scoped lang="scss">
div{
  box-sizing: border-box;
}

.modules-header{
  padding: 1rem 0;
  text-align: left;
  white-space: nowrap;
  .modules-title-en{
    color: #959191;
  }
  .modules-title{
    margin-right: .5rem;
    font-size: 1.2rem;
  }
}
.data-visualization-container{
    position: absolute;
    top: -3rem;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background-color: #000;
    color: #65accd;
    .container,.left-item{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      height: 100%;
      padding: 0 1rem
    }
    .visualization-box{
      position: relative;
      flex: 0 1 28%;
      height: 90%;
      
    }
    .visualization-center{
      flex: 0 1 44%;
      .charts-box{
        width: 100%;
        height: 370px;
      }
    }
    .left-top{
      height: 40%;
    }
    .left-bottom{
      height: 60%;
    }
    .left-item{
      justify-content: flex-start;
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem;
      .sell-data{
        width: 100%;
        font-size: 14px;
      }
      .sell-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .sell-title{
          color: #959191;
        }
      }
      .sell{
        padding: 1rem 0;
        font-size: 1.2rem;
      }
      .percent-box{
        width: 100%;
        text-align: left;
      }
      .sell-progress-bar{
        margin: 2rem 0;
        width: 100%;
        height: .5rem;
      }
      .rank-box{
        width: 100%;
        height: calc(100% - 5rem);
      }
    }
    .visualization-right{
      position: relative;
      .circle-pro{
        width: 3rem;
        height: 3rem
      }
      .right-top{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        .right-top-item{
          padding-left: .5rem;
          padding-top: 1.5rem;
          width: 50%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .info{
            flex: 1;
            span{
              padding: .2rem 1rem;
              width: 100%;
              display: block;
              font-size: 12px;
              text-align: left;
            }
            span:first-child{
              font-size: 2rem;
              font-weight: bold;
              color: #fff;
            }
          }
        }
      }
      .right-bottom{
        margin-top: 40%;
        width: 100%;
        height: 200px;
      }
    }
}
</style>
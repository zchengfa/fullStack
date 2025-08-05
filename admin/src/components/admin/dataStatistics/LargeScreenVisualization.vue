<template>
 <div class="data-visualization-container">
         <div class="container" ref="dataVisualizationRef">
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
             <div class="charts-box">
<!--               <earth></earth>-->
             </div>
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
 </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue';
import CircleProgress from '../../common/CircleProgress.vue';
import BarChartTwo from './BarChartTwo.vue'
import PieRoseChart from './PieRoseChart.vue'
import InfiniteScroll from "../../common/InfiniteScroll.vue";
import {getStatisticsData} from "../../../network/request";
//import Earth from "./Earth.vue";
import SocketService from '../../../socket/socket';
import { URL } from "@/common/utils";

const scrollData = ref([]);
const headerData = ref(['排名','关键词','次数']);
const propertyData = ref(['word','search_count']);
const socket = new SocketService(URL,{
  auth:{
    token: sessionStorage.getItem("token"),
  }
})

function getSData(){
  getStatisticsData().then(res=>{
    scrollData.value = res.data[2].words
  })
}

const getFontSize = ()=>{
  const w = window.innerWidth;
  return  w / 80;
}

//设置html的fontSize
const setFontSizeScreen = (el:HTMLElement)=>{
  el.style.fontSize = `${getFontSize()}px`;
}

onMounted(()=>{
  getSData()
  const element = (document.getElementsByTagName('html').item(0)) as HTMLElement
  setFontSizeScreen(element)
  window.onresize = ()=>{
    setFontSizeScreen(element)
  }

  socket.connect();
  socket.on('data_updated',(data:any)=>{
    console.log(data);
  })

})
onBeforeUnmount(()=>{
  window.onresize = null
  socket.off('data_updated');
})
</script>

<style scoped lang="scss">
$lightBlue: #7cb9bf;
@mixin flexLayout($direction:row,$JC:center,$AI:center,$FW:nowrap) {
  display: flex;
  flex-direction: $direction;
  justify-content: $JC;
  align-items: $AI;
  flex-wrap: $FW;
}
.data-visualization-container{
  div{
    box-sizing: border-box;
  }
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/image/admin/big_screen_bg.png') no-repeat;
  background-size: cover;
  z-index: 999;
  color: $lightBlue;
  .container{
    @include flexLayout();
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-image: url('@/assets/image/admin/bg2.jpg');
    background-repeat: no-repeat;
    background-position: center center;
    .visualization-left,.visualization-right{
      width: 25%;
      height: 100%;
    }
    .visualization-box{
      padding: 1rem;
    }
    .visualization-center{
      width: 50%;
      height: 100%;
      .charts-box{
        width: 100%;
        height: 50%;
      }
    }
    .visualization-left .left-bottom{
      width: 100%;
      height: 60%;
    }
    .visualization-left .left-top{
      width: 100%;
      height: 40%;
      @include flexLayout(column);
      .sell-data{
        margin: 2rem 0;
        font-size: 1.5rem;
      }
      .percent-box{
        width: 90%;
        .sell-progress-bar{
          margin-top: .5rem;
          height: .7rem;
        }
      }
      .sell{
        margin-top: .5rem;
      }
    }
    .unit{
      font-size: 1.1rem;
    }
    .unit::before{
      display: inline-block;
      content: '/';
      margin: 0 .2rem;
    }
    .visualization-right{
      .modules-header{
        @include flexLayout(row);
        width: 100%;
        height: 10%;
        font-size: 1.5rem;
      }
      .right-top{
        width: 100%;
        height: 30%;
        @include flexLayout(row,space-between,center,wrap);
        .right-top-item{
          position: relative;
          width: 50%;
          margin-top: 1rem;
          @include flexLayout(column);
          .circle-pro{
            width: 4rem;
            height: 4rem;
          }
          .info{
            margin-top: .5rem;
            font-size: .8rem;
          }
        }
      }
      .right-bottom{
        @include flexLayout();
        width: 100%;
        height: 60%;
      }
    }
  }
}
.rank-box{
  margin-top: 1rem;
}
</style>

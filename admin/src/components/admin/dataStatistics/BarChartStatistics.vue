<template>
  <div id="bar-chart-statistics"></div>
</template>

<script lang="ts">
import {defineComponent,onMounted} from "vue";
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  DataZoomComponent,
  DataZoomComponentOption
} from 'echarts/components';
import {
  BarChart,
  BarSeriesOption,
  LineChart,
  LineSeriesOption
} from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

type EChartsOption = echarts.ComposeOption<
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
    | DataZoomComponentOption
    | BarSeriesOption
    | LineSeriesOption
    >;

export default defineComponent({
  name: "BarChartStatistics",
  setup(){
    onMounted(()=>{
      let chartDom = <HTMLElement>document.getElementById('bar-chart-statistics')
      let barChart = echarts.init(chartDom)

      /**
       * @param xAxisOneData x轴底部数据 将时间数据作为x轴底部数据
       * @param xAxisTwoData x轴顶部数据 将0-10整数作为x轴顶部数据
       * @param seriesOneData y轴右方数据 将0-1000随机整数作为y轴右方数据
       * @param seriesTwoData y轴左方数据 将5-35随机数作为y轴左方数据
      */
      let xAxisOneData = (()=>{
        let now = new Date()
        let result = []
        let len = 10
        while (len --){
          result.unshift(now.toLocaleTimeString().replace(/\D*/,''))
          now = new Date(+now -2000)
        }
        return result
      })()
      let xAxisTwoData =(()=>{
        let len = 10
        let result = []
        while (len --){
          result.push(10-len-1)
        }
        return result
      })()
      let seriesOneData = (()=>{
        let data = []
        let len = 10
        while (len --){
          data.push(Math.round(Math.random()*1000))
        }
        return data
      })()
      let seriesTwoData = (()=>{
        let len = 10
        let data:number[] = []
        while (len --){
          data.push(Number((Math.random()*30+5).toFixed(1)))
        }
        return data
      })()
      let option:EChartsOption = {
        title: {
          text: '近期商品销售量走势图',
          textStyle:{
            fontSize:14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#f00'
            }
          }
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: xAxisOneData
          },
          {
            type: 'category',
            boundaryGap: true,
            data: xAxisTwoData
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '价格',
            max: (Math.max(...seriesTwoData)+5).toFixed(),
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          {
            type: 'value',
            scale: true,
            name: '订单量',
            max: Math.max(...seriesOneData)+200,
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: [
          {
            name: '销量柱状图',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: seriesOneData
          },
          {
            name: '销量折线',
            type: 'line',
            data: seriesTwoData,
            lineStyle:{
              color:'red'
            }
          }
        ]
      }
      let count = 11
      //设置定时器，每过2秒就刷新一次数据并将新数据加入到图表中
      setInterval(()=>{
        let xAxisData = new Date().toLocaleTimeString().replace(/\D*/,'')

        //先删除原先数组中第一个数据
        xAxisOneData.shift()

        //将新数据加入到数组的最后
        xAxisOneData.push(xAxisData)

        //同上
        xAxisTwoData.shift()
        xAxisTwoData.push(count++)

        seriesOneData.shift()
        seriesOneData.push(Math.round(Math.random()*1000)+100)
        seriesTwoData.shift()
        seriesTwoData.push(Math.round(Math.random()*10))

        //重新配置图表数据
        barChart.setOption({
          xAxis:[
            {
              data:xAxisOneData
            },
            {
              data: xAxisTwoData
            }
          ],
          series:[
            {
              data:seriesOneData
            },
            {
              data: seriesTwoData
            }
          ]
        })
      },2100)
      barChart.setOption(option)
      //让图表的大小根据窗口大小改变而改变
      window.addEventListener('resize',()=>{
        barChart.resize()
      })
    })
  }
})
</script>

<style scoped>
#bar-chart-statistics{
  width: 40rem;
  height: 20rem;
  border: 1px solid #a9a9a9;
  background-color: #FFFFFF;
}
</style>